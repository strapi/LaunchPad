import { Metadata } from 'next';
import { OrdersOverview } from '@/components/dashboard/OrdersOverview';

export const metadata: Metadata = {
  title: 'Book Orders - Dashboard',
};

export default function BookOrdersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Book Pre-Orders</h2>
        <p className="text-gray-400 mt-2">Manage and track pre-orders for The Secure Base</p>
      </div>

      <OrdersOverview />
    </div>
  );
}
