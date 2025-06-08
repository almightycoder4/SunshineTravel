import { Schema, models, model } from 'mongoose';

export interface IActivityLog {
  _id?: string;
  userId: string;
  action: string;
  resource: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  status: 'success' | 'error' | 'warning';
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
    },
    resource: {
      type: String,
      required: [true, 'Resource is required'],
    },
    details: {
      type: String,
      required: [true, 'Details are required'],
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['success', 'error', 'warning'],
      default: 'success',
    },
  },
  {
    timestamps: false, // We're using our own timestamp field
  }
);

const ActivityLog = models.ActivityLog || model<IActivityLog>('ActivityLog', activityLogSchema);

export default ActivityLog;