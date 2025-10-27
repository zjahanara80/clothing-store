const Ticket = require('../models/Ticket');
const sendAnswerEmail = require('../utils/sendEmail');

exports.setAnswer = async (req, res, next) => {
  const { ticketID, message } = req.body;

  try {
    const ticket = await Ticket.findById(ticketID).populate('user');

    if (!ticket || !ticket.title) {
      return res.status(404).json({ message: "تیکت پیدا نشد یا عنوان ندارد!" });
    }

    const answer = await Ticket.create({
      title: ticket.title,
      message,
      name: req.user?.name || "ادمین",
      email: req.user?.email || "",
      parent: ticketID,
      user: req.user?._id || null,
      isAnswer: 1,
      product: ticket.product,
      answer: 0,
    });

    await Ticket.findByIdAndUpdate(ticketID, { answer: 1 });

    const recipientEmail = ticket.user?.email || ticket.email;
    if (recipientEmail) {
      await sendAnswerEmail(
        recipientEmail,
        `پاسخ به تیکت شما: ${ticket.title}`,
        message
      );
    }

    res.json(answer);
  } catch (error) {
    next(error);
  }
};


  exports.deleteTicket = async (req, res) => {
    try {
      const ticketId = req.params.id;
  
      // حذف پاسخ‌های مربوط به این تیکت (در صورت وجود)
      await Ticket.deleteMany({ parent: ticketId });
  
      // حذف خود تیکت
      await Ticket.findByIdAndDelete(ticketId);
  
      res.status(200).json({ message: 'تیکت با موفقیت حذف شد.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'مشکلی در حذف تیکت پیش آمد.' });
    }
  };
  

