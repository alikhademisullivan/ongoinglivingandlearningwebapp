  const express = require('express');
  const nodemailer = require('nodemailer');
  const bodyParser = require('body-parser');
  const { connect } = require('./db');
  const cors = require('cors');
  require('dotenv').config();
  const app = express();
  const ObjectId = require('mongodb').ObjectId;
  const multer = require('multer');
  const path = require('path');
  const fs = require('fs');
  app.use(express.static(path.join(__dirname,'../client/my-app/build')));


  app.use(bodyParser.json());
  app.use(cors());
  app.use(express.json());
  const upload = multer({ dest: 'uploads/' });


  connect().then(({ client, db }) => {
    console.log('Connected to MongoDB');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    app.post('/send-contact-email', async (req, res) => {
      const { name, senderEmail, message } = req.body;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.CLIENT_EMAIL,
        subject: `New Message from ${name}`,
        text: message,
        replyTo: senderEmail
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending email', error);
          return res.status(500).json({ message: 'Error sending email', error });
        }
        res.status(200).json({ message: 'Email sent successfully', info });
      });
    });


  




    const imagesCollection = db.collection('images');
    console.log(__dirname)
    const newslettersCollection = db.collection('newsletters');

    //ali






    const pdfStorage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'uploads/');
      },
      filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
      }
    });

    const uploadPDF = multer({
      storage: pdfStorage,
      fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
      }
    }).single('pdf');

    function checkFileType(file, cb) {
      // Allowed ext
      const filetypes = /pdf/;
      // Check ext
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      // Check mime
      const mimetype = filetypes.test(file.mimetype);

      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb('Error: PDFs Only!');
      }
    }

    app.post('/api/newsletters', uploadPDF, async (req, res) => {
      const newsletterMetadata = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        year: req.body.year,
        month: req.body.month
        // Add any other metadata you need
      };
      await newslettersCollection.insertOne(newsletterMetadata);
      res.json(newsletterMetadata);
    });



    const subscribersCollection = db.collection('subscribers');

    // Endpoint for handling newsletter sign-ups
    app.post('/api/signup', async (req, res) => {
      const { email, name } = req.body;

      // Check if the email address is already subscribed
      const existingSubscriber = await subscribersCollection.findOne({ email });
      if (existingSubscriber) {
        return res.status(400).json({ message: 'Email address is already subscribed' });
      }

      // Insert the new subscriber into the database
      const newSubscriber = { email, name };
      await subscribersCollection.insertOne(newSubscriber);

      res.status(201).json({ message: 'Successfully subscribed to the newsletter' });
    });



    app.get('/api/newsletters', async (req, res) => {
      const { year, month } = req.query;

      if (!year || !month) {
        return res.status(400).json({ message: 'Year and month are required' });
      }

      const newsletters = await newslettersCollection.find({ year, month }).toArray();

      if (!newsletters.length) {
        return res.status(404).json({ message: 'No newsletters found for the given month and year' });
      }

      res.json(newsletters);
    });

    app.use('/api/newsletters', express.static(path.join(__dirname, '..', 'uploads')), function (err, req, res, next) {
      console.error(err.stack);
      res.status(500).send('Error: ' + err.message);
    });

    app.use('/api/images', express.static(path.join(__dirname, '..', 'uploads')), function (err, req, res, next) {
      console.error(err.stack);
      res.status(500).send('Error: ' + err.message);
    });

    app.get('/api/images', async (req, res) => {
      const images = await imagesCollection.find().toArray();
      console.log("WE GOT THE IMAGES")
      res.json(images);
    });

    app.post('/api/images', upload.single('image'), async (req, res) => {
      const imageMetadata = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        // Add any other metadata you need
      };
      await imagesCollection.insertOne(imageMetadata);
      res.json(imageMetadata);
    });
    app.put('/api/events/:eventId/attendees/:person', async (req, res) => {
      const { eventId, person } = req.params;
      const collection = db.collection('events');

      try {
        const result = await collection.updateOne(
          { _id: new ObjectId(eventId) },
          { $pull: { interestedInComing: person }, $push: { attendees: person } }
        );

        if (result.modifiedCount === 1) {
          res.status(200).json({ message: 'Moved person from interested to attending' });
        } else {
          res.status(404).json({ message: 'Event not found' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
      }
    });








    app.post('/api/send-newsletter', async (req, res) => {
      const { month, year } = req.body;
    
      try {
        // Find the newsletter document for the selected month and year
        const newsletter = await newslettersCollection.findOne({ month, year });
    
        // If no newsletter found, return 404
        if (!newsletter) {
          return res.status(404).json({ message: 'Newsletter PDF not found for the selected month and year' });
        }
    
        // Construct the path to the newsletter PDF file
        const pdfPath = path.join(__dirname, '..', 'uploads', newsletter.filename);
    
        // Check if the PDF file exists
        if (!fs.existsSync(pdfPath)) {
          return res.status(404).json({ message: 'Newsletter PDF file not found' });
        }
    
        // Fetch subscribers from MongoDB
        const subscribers = await subscribersCollection.find().toArray();
    
        // Send newsletter to each subscriber
        for (const subscriber of subscribers) {
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: subscriber.email,
            subject: `Newsletter for ${month}/${year}`,
            text: 'Attached is the newsletter for this month.',
            attachments: [{ path: pdfPath }]
          };
    
          // Send email
          await transporter.sendMail(mailOptions);
        }
    
        // Respond with success message
        res.json({ message: 'Newsletter sent successfully to all subscribers' });
      } catch (error) {
        console.error('Error sending newsletter:', error);
        res.status(500).json({ message: 'Failed to send newsletter' });
      }
    });






  app.put('/api/events/:eventId/interested/:person', async (req, res) => {
    const { eventId, person } = req.params;
    const collection = db.collection('events');

    try {
      const result = await collection.updateOne(
        { _id: new ObjectId(eventId) },
        { $push: { interestedInComing: person }, $pull: { attendees: person } }
      );

      if (result.modifiedCount === 1) {
        res.status(200).json({ message: 'Moved person from attending to interested' });
      } else {
        res.status(404).json({ message: 'Event not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });


  app.post('/api/children', async (req, res) => {
    const { name, parentName, allergies, age, address, picturePasscode } = req.body; // Update to include picturePasscode
    const collection = db.collection('children');
    try {
      await collection.insertOne({ name, parentName, allergies, age, address, picturePasscode });
      res.status(201).json({ message: 'Child added successfully' });
    } catch (error) {
      console.error('Error adding child:', error);
      res.status(500).json({ message: 'Error adding child' });
    }
  });

  app.put('/api/children/:id', async (req, res) => {
    const { name, parentName, allergies, age, address } = req.body;
    const collection = db.collection('children');
    await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { name, parentName, allergies, age, address } }
    );
    res.status(200).json({ message: 'Child updated successfully' });
  });

  // Endpoint to add an event
  app.post('/api/events', async (req, res) => {
    const { title, description, date, time, location } = req.body;
    const collection = db.collection('events');
    await collection.insertOne({ title, description, date, time, location, attendees: [], interestedInComing: [] });
    res.status(201).json({ message: 'Event added successfully' });
  });


  app.get('/api/children', async (req, res) => {
    const collection = db.collection('children');
    const children = await collection.find().toArray();
    res.status(200).json(children);
  });

  // Endpoint to get all events
  app.get('/api/events', async (req, res) => {
    const collection = db.collection('events');
    const events = await collection.find().toArray();
    res.status(200).json(events);
  });

  // Endpoint to link a child to an event



  app.post('/api/staffregister', async (req, res) => {
    console.log('Received a POST request to /api/staffregister');

    try {
      const { name, email, phoneNumber, isAdmin, password } = req.body;

      console.log(`Attempting to register staff member with email: ${email}`);

      const collection = db.collection('staff');
      console.log(isAdmin);
      await collection.insertOne({
        name,
        email,
        phoneNumber,
        isAdmin,
        password,
      });

      console.log('Registration successful');
      res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
      console.error('Error occurred during registration:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });


  app.post('/api/stafflogin', async (req, res) => {
    try {
      const { email, password } = req.body;
      const collection = db.collection('staff');
      const user = await collection.findOne({ email, password });
  
      if (user) {
        // Set cookie with user's email
        res.cookie('userEmail', user.email, { maxAge: 24 * 60 * 60 * 1000 }); // Expires in 1 day
        res.status(200).json({ message: 'Login successful', isAdmin: user.isAdmin });
      } else {
        res.status(401).json({ message: 'Invalid login credentials' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  


  app.get('/api/staff', async (req, res) => {
    try {
      const collection = db.collection('staff');

      const staff = await collection.find().toArray();

      res.status(200).json(staff);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  // Endpoint to update isAdmin property of a staff member
  app.put('/api/staff/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { isAdmin } = req.body;

      const collection = db.collection('staff');

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { isAdmin } }
      );

      if (result.modifiedCount === 1) {
        res.status(200).json({ message: 'Update successful' });
      } else {
        res.status(404).json({ message: 'Staff member not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  //Parent gets

  app.get('/api/parents', async (req, res) => {
    try {
      const collection = db.collection('parents');
      const parents = await collection.find({}).toArray();
      res.status(200).json(parents);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.put('/api/parents/:id', async (req, res) => {
    try {
      const collection = db.collection('parents');
      const parent = await collection.findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: { isRegistered: req.body.isRegistered } },
        { returnOriginal: false }
      );
      res.status(200).json(parent.value);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  //parent gets











  app.post('/api/register', async (req, res) => {
    try {
      const { firstName, lastName, email, phoneNumber, isRegistered } = req.body;

      const collection = db.collection('parents'); // use the name of your collection

      await collection.insertOne({
        firstName,
        lastName,
        email,
        phoneNumber,
        isRegistered,
      });

      res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  app.get('/api/parents', async (req, res) => {
    try {
      const collection = db.collection('parents');
      const parents = await collection.find().toArray();
      res.status(200).json(parents);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  app.post('/api/parents/send-friend-request/:parentLastName', async (req, res) => {
    try {
      const { parentLastName } = req.params;
      const { requestingParentLastName } = req.body;

      const collection = db.collection('parents');

      // Update the parent sending the friend request
      const resultSender = await collection.updateOne(
        { lastName: requestingParentLastName },
        { $addToSet: { sentFriendRequests: parentLastName } }
      );

      // Update the target parent receiving the friend request
      const resultTarget = await collection.updateOne(
        { lastName: parentLastName },
        { $addToSet: { receivedFriendRequests: requestingParentLastName } }
      );

      if (resultSender.modifiedCount === 1 && resultTarget.modifiedCount === 1) {
        res.status(200).json({ message: 'Friend request sent successfully' });
      } else {
        res.status(404).json({ message: 'Parent not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  });

  app.get('/api/parents/received-friend-requests/:parentLastName', async (req, res) => {
    try {
      const { parentLastName } = req.params;
      const collection = db.collection('parents');

      // Find the parent document based on lastName
      const parent = await collection.findOne({ lastName: parentLastName });

      if (!parent) {
        return res.status(404).json({ message: 'Parent not found' });
      }

      // Fetch received friend requests
      const receivedFriendRequests = await collection
        .find({ lastName: { $in: parent.receivedFriendRequests } })
        .project({ firstName: 1, lastName: 1 }) // Adjust the fields as needed
        .toArray();

      res.status(200).json(receivedFriendRequests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  });


  app.get('/api/parents/friends/:parentLastName', async (req, res) => {
    try {
      const { parentLastName } = req.params;
      const collection = db.collection('parents');

      // Find the parent document based on lastName
      const parent = await collection.findOne({ lastName: parentLastName });

      if (!parent) {
        return res.status(404).json({ message: 'Parent not found' });
      }

      // Fetch friends
      const friends = await collection
        .find({ lastName: { $in: parent.friends } })
        .project({ firstName: 1, lastName: 1 }) // Adjust the fields as needed
        .toArray();

      res.status(200).json(friends);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  });

  app.post('/api/parents/accept-friend-request/:parentLastName', async (req, res) => {
    try {
      const { parentLastName } = req.params;
      const { acceptingParentLastName } = req.body;

      const collection = db.collection('parents');

      // Update the accepting parent's friends list
      const resultAccepting = await collection.updateOne(
        { lastName: acceptingParentLastName },
        { $addToSet: { friends: parentLastName } }
      );

      // Update the sending parent's friends list
      const resultSending = await collection.updateOne(
        { lastName: parentLastName },
        { $addToSet: { friends: acceptingParentLastName } }
      );

      // Remove the friend request from both parents
      const resultRemoveRequestAccepting = await collection.updateOne(
        { lastName: acceptingParentLastName },
        { $pull: { receivedFriendRequests: parentLastName } }
      );

      const resultRemoveRequestSending = await collection.updateOne(
        { lastName: parentLastName },
        { $pull: { sentFriendRequests: acceptingParentLastName } }
      );

      if (
        resultAccepting.modifiedCount === 1 &&
        resultSending.modifiedCount === 1 &&
        resultRemoveRequestAccepting.modifiedCount === 1 &&
        resultRemoveRequestSending.modifiedCount === 1
      ) {
        res.status(200).json({ message: 'Friend request accepted successfully' });
      } else {
        res.status(404).json({ message: 'Parent not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  });

  app.post('/api/parents/reject-friend-request/:parentLastName', async (req, res) => {
    try {
      const { parentLastName } = req.params;
      const { rejectingParentLastName } = req.body;

      const collection = db.collection('parents');

      // Remove the friend request from both parents
      const resultRemoveRequestRejecting = await collection.updateOne(
        { lastName: rejectingParentLastName },
        { $pull: { receivedFriendRequests: parentLastName } }
      );

      const resultRemoveRequestSending = await collection.updateOne(
        { lastName: parentLastName },
        { $pull: { sentFriendRequests: rejectingParentLastName } }
      );

      if (
        resultRemoveRequestRejecting.modifiedCount === 1 &&
        resultRemoveRequestSending.modifiedCount === 1
      ) {
        res.status(200).json({ message: 'Friend request rejected successfully' });
      } else {
        res.status(404).json({ message: 'Parent not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  });
  app.post('/api/login', async (req, res) => {
    try {
      const { lastName, phoneNumber } = req.body;

      const collection = db.collection('parents');

      // Check if a user with the provided last name and phone number exists
      const user = await collection.findOne({
        lastName,
        phoneNumber,
      });

      if (user && user.isRegistered === true) {
        // Include _id in the response
        const { _id, firstName, lastName, email, phoneNumber } = user;
        res.status(200).json({ _id, firstName, lastName, email, phoneNumber });
      } else {
        res.status(401).json({ message: 'Invalid login credentials' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  //messages
  app.post('/api/messages/send', async (req, res) => {
    try {
      const { sender, receiver, content } = req.body;

      const messagesCollection = db.collection('messages');

      await messagesCollection.insertOne({ sender, receiver, content });

      res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  });

  // Get messages endpoint
  app.get('/api/messages/:sender/:receiver', async (req, res) => {
    try {
      const { sender, receiver } = req.params;

      const messagesCollection = db.collection('messages');

      const messages = await messagesCollection.find({
        $or: [
          { sender, receiver },
          { sender: receiver, receiver: sender },
        ],
      }).toArray();

      res.status(200).json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  });

  app.post('/api/childEventRegistration', async (req, res) => {
    try {
      // Get the registration data from the request body
      const { childName, childDisability, eventName, eventDate, parentPresent } = req.body;

      // Access the ChildEventReg collection in MongoDB
      const collection = db.collection('ChildEventReg');

      // Insert the registration data into the collection
      await collection.insertOne({
        childName,
        childDisability,
        eventName,
        eventDate,
        parentPresent,
      });

      // Respond with a success status
      res.status(200).send('Registration successful');
    } catch (error) {
      console.error(error);
      // Respond with an error status
      res.status(500).send('Internal Server Error');
    }
  });


  app.post('/api/childRegister', async (req, res) => {
    console.log('Received a POST request to /api/childRegister');

    try {
      const { name, email, phoneNumber, isAdmin, password } = req.body;

      console.log(`Attempting to register staff member with email: ${email}`);

      const collection = db.collection('staff');
      console.log(isAdmin);
      await collection.insertOne({
        name,
        email,
        phoneNumber,
        isAdmin,
        password,
      });

      console.log('Registration successful');
      res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
      console.error('Error occurred during registration:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.get('/api/childrenCollection', async (req, res) => {
    try {
      const collection = db.collection('children');
      const children = await collection.find({}, { projection: { name: 1, _id: 0 } }).toArray();
      res.json(children.map(child => child.name));
    } catch (error) {
      res.status(500).send('Error retrieving names');
    }
  });

  app.post('/api/childLogin', async (req, res) => {
    const { name, pictureSequence } = req.body;

    try {
      const collection = db.collection('children');
      const child = await collection.findOne({ name });

      if (!child) {
        return res.status(401).send('Username not found');
      }

      if (JSON.stringify(child.picturePasscode) === JSON.stringify(pictureSequence)) {
        // User is authenticated
        // Create a session or token here
        res.send('User authenticated successfully');
      } else {
        res.status(401).send('Invalid picture passcode');
      }
    } catch (error) {
      res.status(500).send('Error during authentication');
    }
  });

  
  
  app.get('/api/reviewsadmin', async (req, res) => {
    try {
      const reviews = await db.collection('reviews').find().sort({ createdAt: -1 }).toArray();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await db.collection('reviews').find({
            $or: [
                { ishidden: { $exists: false } },
                { ishidden: false }
            ]
        }).sort({ createdAt: -1 }).toArray();
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
  // PUT route to update review status
  app.put('/api/reviews/:id', async (req, res) => {
    const reviewId = req.params.id;
    const { isHidden } = req.body;

    try {
        // Update the review status in the database
        const result = await db.collection('reviews').updateOne(
            { _id: new ObjectId(reviewId) }, // Use new ObjectId() here
            { $set: { ishidden: isHidden } }
        );

        if (result.modifiedCount === 0) {
            throw new Error('Review not found or not updated.');
        }

        res.status(200).json({ message: 'Review status updated successfully' });
    } catch (error) {
        console.error('Error updating review status:', error);
        res.status(500).json({ message: error.message });
    }
});

  // POST a review
  app.post('/api/reviews', async (req, res) => {
    const review = {
      name: req.body.name,
      rating: req.body.rating,
      comment: req.body.comment,
      anonymous: req.body.anonymous,
      createdAt: new Date(),
      ishidden: false,
    };
  
    try {
      const result = await db.collection('reviews').insertOne(review);
      res.status(201).json(result.ops[0]);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get('/api/events', async (req, res) => {
    try {
      const events = await db.collection('events').find().toArray();
      res.json(events);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  app.get('/api/announcements', async (req, res) => {
    try {
      const announcements = await db.collection('announcements').find().toArray();
      res.json(announcements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.post('/api/announcements', async (req, res) => {
    const { title, date, description } = req.body;
    const newAnnouncement = {
      title,
      date: date ? new Date(date) : new Date(),
      description,
    };
    try {
      await db.collection('announcements').insertOne(newAnnouncement);
      res.status(201).json(newAnnouncement);
    } catch (error) {
      console.error('Error adding announcement:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/api/clockin', async (req, res) => {
    const { email } = req.body;
    const clockInTime = new Date();
  
    try {
      const collection = db.collection('attendance');
      const result = await collection.insertOne({
        email,
        clockInTime,
        clockOutTime: null
      });
  
      if (result.insertedId) {
        res.status(200).json({ message: 'Clock-in recorded successfully' });
      } else {
        res.status(400).json({ message: 'Failed to record clock-in' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

  app.post('/api/clockout', async (req, res) => {
    const { email } = req.body;
    const clockOutTime = new Date();
  
    try {
      console.log("Attempting to clock out for email:", email);

      const collection = db.collection('attendance');
      // Update the latest clock-in record for the user with the clock-out time
      const result = await collection.findOneAndUpdate(
        { email, clockOutTime: null }, // filter to get the last clock-in without clock-out
        { $set: { clockOutTime } },
        { sort: { clockInTime: -1 }, returnDocument: 'after'  } // ensure we update the latest clock-in record
      );
      console.log("Query result:", result);
      console.log("Type of result.value:", typeof result.value);
      console.log("Value of result.value:", result.value);
      res.status(200).json({ message: 'Clock-out recorded successfully' });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  
  app.get('/api/attendance/today', async (req, res) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
  
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
  
    try {
      const collection = db.collection('attendance');
      const records = await collection.find({
        clockInTime: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      }).toArray();
  
      res.status(200).json(records);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

 //KEEP THIS BELOW EVERYTHING DONT PUT THIS AT THE TOP, PRODUCTION BUILD WILL BREAK
 app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/my-app/build/index.html'));
});

  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});
