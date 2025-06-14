"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="py-24"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div variants={itemVariants}>
              <Image
                src="/qr-code.svg"
                alt="QR Code"
                width={128}
                height={128}
                className="mx-auto"
              />
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mt-6"
            >
              The Future of Ordering is Here
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl"
            >
              Paytab is a revolutionary QR ordering and payment system that allows your customers to order and pay with a simple scan. No apps, no downloads, no hassle.
            </motion.p>
            <motion.div variants={itemVariants} className="mt-8">
              <Link
                href="#features"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-8 py-3 text-base font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          id="features"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="py-24 bg-muted"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to run your business
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Paytab is packed with features to help you streamline your operations, increase efficiency, and boost your revenue.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <motion.div variants={itemVariants} className="p-6 bg-background rounded-lg shadow-md">
                <h3 className="text-xl font-semibold">QR Code Ordering</h3>
                <p className="mt-4 text-muted-foreground">
                  Customers can scan a QR code at their table to view your menu and place an order directly from their phone.
                </p>
              </motion.div>
              {/* Feature 2 */}
              <motion.div variants={itemVariants} className="p-6 bg-background rounded-lg shadow-md">
                <h3 className="text-xl font-semibold">Seamless Payments</h3>
                <p className="mt-4 text-muted-foreground">
                  Integrated payments allow customers to pay their bill directly from their phone, with support for all major credit cards and digital wallets.
                </p>
              </motion.div>
              {/* Feature 3 */}
              <motion.div variants={itemVariants} className="p-6 bg-background rounded-lg shadow-md">
                <h3 className="text-xl font-semibold">Real-time Analytics</h3>
                <p className="mt-4 text-muted-foreground">
                  Get valuable insights into your sales, customers, and menu performance with our powerful analytics dashboard.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section
          id="how-it-works"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="py-24 bg-background"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                How it Works
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                A simple and intuitive process for both you and your customers.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3 text-center">
              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-semibold">1. Scan</h3>
                <p className="mt-4 text-muted-foreground">
                  Customer scans the QR code on the table.
                </p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-semibold">2. Order</h3>
                <p className="mt-4 text-muted-foreground">
                  Customer browses the menu and places their order.
                </p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-semibold">3. Pay</h3>
                <p className="mt-4 text-muted-foreground">
                  Customer pays securely through their phone.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
}
