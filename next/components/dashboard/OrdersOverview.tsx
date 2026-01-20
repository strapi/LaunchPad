'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IconBook, IconCurrencyDollar, IconPackage, IconClock } from '@tabler/icons-react';

interface Order {
  id: number;
  attributes: {
    fullName: string;
    email: string;
    orderType: string;
    quantity: number;
    totalAmount: number;
    paymentStatus: string;
    fulfillmentStatus: string;
    createdAt: string;
    personalizationMessage?: string;
  };
}

export function OrdersOverview() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    signedCopies: 0,
    pendingFulfillment: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/book-preorders?sort=createdAt:desc&pagination[limit]=100`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );
      const data = await response.json();
      
      if (data.data) {
        setOrders(data.data);
        
        // Calculate stats
        const totalOrders = data.data.length;
        const totalRevenue = data.data.reduce(
          (sum: number, order: Order) => sum + order.attributes.totalAmount,
          0
        );
        const signedCopies = data.data.filter(
          (order: Order) => order.attributes.orderType === 'signed-hardcover' || order.attributes.orderType === 'bundle'
        ).reduce((sum: number, order: Order) => sum + order.attributes.quantity, 0);
        const pendingFulfillment = data.data.filter(
          (order: Order) => order.attributes.fulfillmentStatus !== 'shipped' && order.attributes.fulfillmentStatus !== 'delivered'
        ).length;

        setStats({
          totalOrders,
          totalRevenue,
          signedCopies,
          pendingFulfillment,
        });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: 'bg-green-500',
      pending: 'bg-yellow-500',
      failed: 'bg-red-500',
      processing: 'bg-blue-500',
      shipped: 'bg-purple-500',
      delivered: 'bg-green-600',
    };
    return colors[status] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Orders</CardTitle>
            <IconBook className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Revenue</CardTitle>
            <IconCurrencyDollar className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${stats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Signed Copies</CardTitle>
            <IconPackage className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.signedCopies}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Pending Fulfillment</CardTitle>
            <IconClock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.pendingFulfillment}</div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Recent Orders</CardTitle>
          <CardDescription className="text-gray-400">
            All book pre-orders and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-white/10">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-gray-300">Customer</TableHead>
                  <TableHead className="text-gray-300">Order Type</TableHead>
                  <TableHead className="text-gray-300">Qty</TableHead>
                  <TableHead className="text-gray-300">Amount</TableHead>
                  <TableHead className="text-gray-300">Payment</TableHead>
                  <TableHead className="text-gray-300">Fulfillment</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="text-white">
                      <div>
                        <div className="font-medium">{order.attributes.fullName}</div>
                        <div className="text-sm text-gray-400">{order.attributes.email}</div>
                        {order.attributes.personalizationMessage && (
                          <div className="text-xs text-cyan-400 mt-1">
                            "{order.attributes.personalizationMessage}"
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {order.attributes.orderType
                        .split('-')
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(' ')}
                    </TableCell>
                    <TableCell className="text-gray-300">{order.attributes.quantity}</TableCell>
                    <TableCell className="text-green-400 font-medium">
                      ${order.attributes.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.attributes.paymentStatus)}>
                        {order.attributes.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.attributes.fulfillmentStatus)}>
                        {order.attributes.fulfillmentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {new Date(order.attributes.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
