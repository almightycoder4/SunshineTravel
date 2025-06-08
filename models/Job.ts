import mongoose from 'mongoose';
import { Schema, models, model } from 'mongoose';

export interface IJob {
  _id?: string;
  title: string;
  company: string;
  location: string;
  country: string;
  salary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  type: string;
  experience: string;
  featured: boolean;
  date: string;
  trade: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    salary: {
      type: String,
      required: [true, 'Salary information is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    responsibilities: [{
      type: String,
      required: [true, 'At least one responsibility is required'],
    }],
    requirements: [{
      type: String,
      required: [true, 'At least one requirement is required'],
    }],
    benefits: [{
      type: String,
      required: [true, 'At least one benefit is required'],
    }],
    type: {
      type: String,
      required: [true, 'Job type is required'],
      trim: true,
    },
    experience: {
      type: String,
      required: [true, 'Experience level is required'],
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    trade: {
      type: String,
      required: [true, 'Trade category is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Job = models.Job || model<IJob>('Job', jobSchema);

export default Job;