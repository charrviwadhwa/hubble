// server/controllers/certificateController.js

export const getCertificateData = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    // 1. Find the registration and populate the event
    const registration = await Registration.findOne({ 
      event: eventId, 
      user: userId,
      attended: true 
    }).populate('event');

    if (!registration) {
      return res.status(404).json({ message: "Attendance not verified." });
    }

    // 2. Fetch the user to get their specific college/university
    const user = await User.findById(userId);

    // 3. Return data specific to this user and event
    res.json({
      userName: user.name,
      collegeName: user.university || "Authorized Institution", // 🟢 Dynamic College Name
      eventName: registration.event.title,
      societyName: registration.event.societyName,
      societyLogo: registration.event.societyLogo,
      issueDate: registration.updatedAt,
      certId: `HUB-${registration._id.toString().slice(-8).toUpperCase()}`
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching certificate details" });
  }
};