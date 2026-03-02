"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface OrderData {
    orderId: string;
    name: string;
    lastname: string;
    address: string;
    city: string;
    country: string;
    apartment: string;
    timestamp: number;
}

const ThankYouContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [order, setOrder] = useState<OrderData | null>(null);
    const [loading, setLoading] = useState(true);
    const hasValidated = useRef(false);

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

    return (
        <div className="bg-gray-50 min-h-[80vh] py-16 sm:py-24">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <div className="bg-white px-8 py-12 sm:p-16 shadow-lg rounded-2xl flex flex-col items-center text-center">
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

                    <div className="w-full text-left bg-gray-50 rounded-xl p-8 border border-gray-100 shadow-sm space-y-6">
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3">
                            Order Details
                        </h2>

                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 text-sm">
                            <div className="sm:col-span-2">
                                <dt className="font-semibold text-gray-500 uppercase tracking-wider text-xs">Order Number</dt>
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

                            <div className="sm:col-span-2 mt-2">
                                <dt className="font-semibold text-gray-500 uppercase tracking-wider text-xs">Shipping Address</dt>
                                <dd className="mt-2 text-base text-gray-900 space-y-1">
                                    <p>{order.address}</p>
                                    {order.apartment && <p>Apt/Suite: {order.apartment}</p>}
                                    <p>{order.city}, {order.country}</p>
                                </dd>
                            </div>
                        </dl>
                    </div>

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
