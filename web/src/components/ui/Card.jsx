import * as React from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, ...props }) {
  return (
    <div
      className={cn("rounded-xl border border-gray-200 bg-surface text-text shadow-sm dark:border-gray-800 dark:bg-surface-dark", className)}
      {...props} />);


}

export function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props} />);


}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn("font-semibold leading-none tracking-tight", className)}
      {...props} />);


}

export function CardContent({ className, ...props }) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props} />);

}