import mongoose from 'mongoose';

interface ISuccessStory {
  customerName: string;
  customerImage: string;
  jobTitle: string;
  company: string;
  location: string;
  testimonial: string;
  rating: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SuccessStorySchema = new mongoose.Schema<ISuccessStory>({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [100, 'Customer name cannot exceed 100 characters']
  },
  customerImage: {
    type: String,
    required: [true, 'Customer image is required']
  },
  jobTitle: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  testimonial: {
    type: String,
    required: [true, 'Testimonial is required'],
    trim: true,
    maxlength: [1000, 'Testimonial cannot exceed 1000 characters']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
SuccessStorySchema.index({ createdAt: -1 });
SuccessStorySchema.index({ rating: -1 });
SuccessStorySchema.index({ company: 1 });

const SuccessStory = mongoose.models.SuccessStory || mongoose.model<ISuccessStory>('SuccessStory', SuccessStorySchema);

export default SuccessStory;
export type { ISuccessStory };