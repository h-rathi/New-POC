"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircleIcon, TruckIcon, ClockIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface OrderItem {
    title: string;
    price: number;
    amount: number;
    image: string;
}

interface OrderData {
    orderId: string;
    name: string;
    lastname: string;
    address: string;
    city: string;
    country: string;
    apartment: string;
    postalCode: string;
    total: number;
    items: OrderItem[];
    timestamp: number;
}

const ThankYouContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [order, setOrder] = useState<OrderData | null>(null);
    const [loading, setLoading] = useState(true);
    const hasValidated = useRef(false);

    // Calculate Estimated Delivery Time (2 days from now)
    const getEstimatedDelivery = () => {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 2);
        return deliveryDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    useEffect(() => {
        if (hasValidated.current) return;
        hasValidated.current = true;

        const encodedData = searchParams.get("data");

        if (!encodedData) {
            toast.error("Unauthorized Access. No valid order payload found.");
            router.replace("/");
            return;
        }

        try {
            // Decode the base64 payload. We use atob and decodeURIComponent to support special characters correctly and avoid Node.js Buffer APIs in the browser.
            const decodedString = decodeURIComponent(atob(encodedData));
            const data: OrderData = JSON.parse(decodedString);

            // Simple time-based validation (e.g., within the last 15 minutes) to deter replay attacks somewhat.
            const orderTime = new Date(data.timestamp).getTime();
            const currentTime = new Date().getTime();
            const differenceInMinutes = (currentTime - orderTime) / (1000 * 60);

            if (differenceInMinutes > 15 || !data.orderId) {
                toast.error("Order session expired or invalid.");
                router.replace("/");
                return;
            }

            setOrder(data);

            // Clean up the URL to prevent users from sharing the URL directly and re-rendering the same page or exposing data.
            window.history.replaceState(null, "", "/thank-you");
        } catch (error) {
            console.error("Failed to parse order data", error);
            toast.error("Invalid order data.");
            router.replace("/");
        } finally {
            setLoading(false);
        }
    }, [router, searchParams]);

    if (loading || !order) {
        return (
            <div className="flex justify-center items-center min-h-[60vh] bg-gray-50">
                <span className="loading loading-spinner loading-lg text-blue-500"></span>
            </div>
        );
    }

    const itemsTotal = order.items?.reduce((sum, item) => sum + item.price * item.amount, 0) ?? order.total ?? 0;

    return (
        <div className="bg-gray-50 min-h-[80vh] py-16 sm:py-24">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <div className="bg-white px-8 py-12 sm:p-16 shadow-lg rounded-2xl flex flex-col items-center text-center">
                    {/* Success Icon */}
                    <div className="mb-6 flex items-center justify-center h-24 w-24 rounded-full bg-green-100 ring-8 ring-green-50 shadow-inner">
                        <CheckCircleIcon className="h-14 w-14 text-green-500" aria-hidden="true" />
                    </div>

                    <h1 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl mb-4">
                        Thank you for your order!
                    </h1>
                    <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10">
                        We've received your order and will contact you shortly to arrange payment details.
                        Your items are being prepared for shipping.
                    </p>

                    {/* Order Details Section */}
                    <div className="w-full text-left space-y-8">

                        {/* Order ID & Customer Info */}
                        <div className="bg-gray-50 rounded-xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3">
                                Order Details
                            </h2>

                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 text-sm">
                                <div className="sm:col-span-2">
                                    <dt className="font-semibold text-gray-500 uppercase tracking-wider text-xs">Order ID</dt>
                                    <dd className="mt-2 text-lg font-mono text-gray-900 font-bold bg-gray-200 px-3 py-1 rounded-md inline-block">
                                        {order.orderId}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="font-semibold text-gray-500 uppercase tracking-wider text-xs">Customer Name</dt>
                                    <dd className="mt-2 text-base text-gray-900 font-medium capitalize">
                                        {order.name} {order.lastname}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="font-semibold text-gray-500 uppercase tracking-wider text-xs">Order Total</dt>
                                    <dd className="mt-2 text-base text-gray-900 font-bold">
                                        ${itemsTotal.toFixed(2)}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* Items Ordered */}
                        {order.items && order.items.length > 0 && (
                            <div className="bg-gray-50 rounded-xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-4">
                                    Items Ordered
                                </h2>
                                <ul className="divide-y divide-gray-200">
                                    {order.items.map((item, index) => (
                                        <li key={index} className="flex items-center gap-4 py-4">
                                            <img
                                                src={
                                                    item.image
                                                        ? item.image.startsWith("http://") || item.image.startsWith("https://")
                                                            ? item.image
                                                            : `/${item.image}`
                                                        : "/product_placeholder.jpg"
                                                }
                                                alt={item.title}
                                                className="h-16 w-16 rounded-lg object-cover object-center border border-gray-200"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
                                                <p className="text-sm text-gray-500">Qty: {item.amount}</p>
                                            </div>
                                            <p className="text-sm font-bold text-gray-900 whitespace-nowrap">
                                                ${(item.price * item.amount).toFixed(2)}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Shipping Address */}
                        <div className="bg-gray-50 rounded-xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
                            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3">
                                Shipping Address
                            </h2>
                            <div className="text-base text-gray-700 space-y-1">
                                <p>{order.address}</p>
                                {order.apartment && <p>Apt/Suite: {order.apartment}</p>}
                                <p>{order.city}{order.postalCode ? `, ${order.postalCode}` : ""}</p>
                                <p>{order.country}</p>
                            </div>
                        </div>

                        {/* Estimated Delivery */}
                        <div className="bg-blue-50 rounded-xl p-6 sm:p-8 border border-blue-100 shadow-sm flex items-start gap-4">
                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                                <TruckIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-blue-900">Estimated Delivery</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <ClockIcon className="h-4 w-4 text-blue-500" />
                                    <p className="text-base text-blue-800 font-medium">{getEstimatedDelivery()}</p>
                                </div>
                                
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-12 w-full flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => router.push("/shop")}
                            className="btn btn-primary min-w-[200px] text-lg font-medium shadow-md transition-transform hover:-translate-y-0.5"
                        >
                            Continue Shopping
                        </button>
                        <button
                            onClick={() => router.push("/")}
                            className="btn btn-outline min-w-[200px] text-lg font-medium"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Next.js SearchParams components need to be wrapped in a suspense boundary during SSR/Static rendering
const ThankYouPage = () => {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-[60vh] bg-gray-50">
                <span className="loading loading-spinner loading-lg text-blue-500"></span>
            </div>
        }>
            <ThankYouContent />
        </Suspense>
    );
};

export default ThankYouPage;
