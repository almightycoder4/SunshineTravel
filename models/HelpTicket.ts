import { Schema, models, model } from 'mongoose';

export interface IHelpTicket {
  _id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  problemType: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const helpTicketSchema = new Schema<IHelpTicket>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
    },
    userEmail: {
      type: String,
      required: [true, 'User email is required'],
    },
    userName: {
      type: String,
      required: [true, 'User name is required'],
    },
    problemType: {
      type: String,
      required: [true, 'Problem type is required'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
      default: 'open',
    },
  },
  {
    timestamps: true,
  }
);

const HelpTicket = models.HelpTicket || model<IHelpTicket>('HelpTicket', helpTicketSchema);

export default HelpTicket;