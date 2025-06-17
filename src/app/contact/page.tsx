'use client';

import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, MessageSquare, Phone, Mail } from 'lucide-react';
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { submitContactFormAction } from "@/app/actions/submit-contact";
import { Separator } from "@/components/ui/separator";

import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "@/components/ui/select";

/*───────────────────────────────────────────────────────────────────────────*/
/*  ── Options map  ───────────────────────────────────────────────────────  */

const SUBJECT_OPTIONS: Record<string, string[]> = {
  investment: [
    "Mutual Fund Planning",
    "Equity Portfolio Advisory",
    "NRI Investment Services",
    "Wealth Building Workshops",
    "Alternative Investment Funds",
    "Portfolio Management Services",
    "Smallcase Portfolios",
    "Non-Convertible Debentures",
  ],
  insurance: [
    "Life Insurance",
    "Health Insurance",
    "Bonds",
    "Invoice Discounting / FDs",
  ],
  loans: [
    "Home Loans",
    "Education Loans",
    "Loan Against Mutual Funds",
  ],
  software: [
    "Website Hosting & Domain",
    "Google Workspace",
    "SME Digital Launch Pack",
    "Technical Consulting",
  ],
  foundation: [
    "General Enquiry",
  ],
};

/*───────────────────────────────────────────────────────────────────────────*/
/*  ── Zod schema  ─────────────────────────────────────────────────────────  */

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  category: z.string().min(1, "Please choose a category"),
  subject: z.string().min(1, "Please pick a service"),
  message: z.string().min(5, "Message must be at least 5 characters long"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

/*───────────────────────────────────────────────────────────────────────────*/
/*  ── Component  ──────────────────────────────────────────────────────────  */

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      category: "",
      subject: "",
      message: "",
    },
  });

  /*──────────────────────── Submission ────────────────────────*/
  async function onSubmit(values: ContactFormValues) {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) => formData.append(k, v));
    try {
      const result = await submitContactFormAction(formData);
      if (result.success) {
        toast({ title: "Message Sent!", description: "We will get back to you soon." });
        form.reset();
      } else {
        toast({ title: "Sending Failed", description: result.error, variant: "destructive" });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Unexpected error. Try later.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isMounted) return null;

  /*──────────────────────── Render ────────────────────────────*/
  return (
    <div className="container mx-auto flex-grow py-8 sm:py-12 md:py-16 lg:py-20 px-4 md:px-6">
      <Card className="max-w-2xl w-full mx-auto border-0 shadow-none">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Contact Us</CardTitle>
          <CardDescription>We're here to help. Fill out the form below.</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl><Input placeholder="Your Name" {...field} disabled={isSubmitting} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="you@example.com" {...field} disabled={isSubmitting} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category (titles selectable) */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        form.setValue("subject", ""); // reset service when category changes
                      }}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="investment">Investment Planning</SelectItem>
                        <SelectItem value="insurance">Insurance</SelectItem>
                        <SelectItem value="loans">Loans</SelectItem>
                        <SelectItem value="software">Software Solutions</SelectItem>
                        <SelectItem value="foundation">Beart Foundation</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Service (depends on category) */}
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => {
                  const category = form.watch("category");
                  const options = SUBJECT_OPTIONS[category as keyof typeof SUBJECT_OPTIONS] ?? [];
                  return (
                    <FormItem>
                      <FormLabel>Service</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!category || isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={category ? "Select a service" : "Select category first"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {options.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Message */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl><Textarea rows={4} placeholder="How can we help you?" {...field} disabled={isSubmitting} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Form>

          <Separator className="my-6" />

          {/* Direct contact section (unchanged) */}
          <div className="space-y-3">
            <Button size="lg" className="w-full justify-start gap-2" asChild>
              <Link href="https://wa.me/919145656666" target="_blank">
                <MessageSquare className="h-4 w-4" /> WhatsApp Us (+91‑9145656666)
              </Link>
            </Button>
            <Button size="lg" className="w-full justify-start gap-2" asChild>
              <Link href="tel:+919145656666"><Phone className="h-4 w-4" /> Call +91‑9145656666</Link>
            </Button>
            <Button size="lg" className="w-full justify-start gap-2" asChild>
              <Link href="mailto:info@beartindia.com"><Mail className="h-4 w-4" /> Email: info@beartindia.com</Link>
            </Button>
            <Button size="lg" className="w-full justify-start gap-2" asChild>
              <Link href="/contact?service=Consultation"><FileText className="h-4 w-4" /> Schedule a Free Consultation</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
