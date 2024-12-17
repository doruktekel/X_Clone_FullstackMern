import { Notification } from "../models/notification.model.js";

const getAllNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({
      to: userId,
    })
      .sort({ createdAt: -1 })
      .populate("from", "userName profileImage");

    await Notification.updateMany(
      {
        to: userId,
        read: false,
      },
      {
        read: true,
      }
    );

    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in getAllNotifications func", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const deletedNotifications = await Notification.deleteMany({ to: userId });
    res.status(200).json({ message: "Notifications deleted successfully" });
  } catch (error) {
    console.log("Error in getAllNotifications func", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { getAllNotifications, deleteAllNotifications };
