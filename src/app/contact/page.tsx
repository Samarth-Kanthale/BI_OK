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
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(5, "Message must be at least 5 characters long"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: ContactFormValues) {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    try {
      const result = await submitContactFormAction(formData);
      if (result.success) {
        toast({
          title: "Message Sent!",
          description: "Thank you for contacting us. We will get back to you soon.",
        });
        form.reset();
      } else {
        toast({
          title: "Sending Failed",
          description: result.error || "An error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isMounted) {
    return null;
  }

  return (
    <div className="container mx-auto flex-grow py-8 sm:py-12 md:py-16 lg:py-20 px-4 md:px-6">
      <Card className="max-w-2xl w-full mx-auto animate-in fade-in zoom-in-95 duration-500 border-0 shadow-none">
        <CardHeader className="text-left">
          <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold animate-in fade-in slide-in-from-top-8 duration-700">Contact Us</CardTitle>
          <CardDescription className="text-sm sm:text-base animate-in fade-in slide-in-from-top-10 duration-700 delay-100">We're here to help. Reach out through any of the methods below or fill out the form.</CardDescription>
        </CardHeader>

        <CardContent className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <div className="flex flex-col gap-8 md:gap-10 mb-8">

            <div className="w-full text-left">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Send Us a Message</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only md:not-sr-only">Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Name" {...field} disabled={isSubmitting} className="transition-shadow focus:shadow-md text-sm sm:text-base" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only md:not-sr-only">Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@example.com" {...field} disabled={isSubmitting} className="transition-shadow focus:shadow-md text-sm sm:text-base" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* ✅ DROPDOWN SUBJECT FIELD */}
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only md:not-sr-only">Subject</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full transition-shadow focus:shadow-md text-sm sm:text-base">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Insurance</SelectLabel>
                              <SelectItem value="Mutual Fund Planning">Mutual Fund Planning</SelectItem>
                              <SelectItem value="Equity Portfolio Advisory">Equity Portfolio Advisory</SelectItem>
                              <SelectItem value="NRI Investment Services">NRI Investment Services</SelectItem>
                              <SelectItem value="Wealth Building Workshops">Wealth Building Workshops</SelectItem>
                              <SelectItem value="Alternative Investment Funds">Alternative Investment Funds</SelectItem>
                              <SelectItem value="Portfolio Management Services">Portfolio Management Services</SelectItem>
                              <SelectItem value="Non-Convertible Debentures">Non-Convertible Debentures</SelectItem>
                              <SelectItem value="Smallcase Portfolios">Smallcase Portfolios</SelectItem>
                              <SelectItem value="Life Insurance">Life Insurance</SelectItem>
                              <SelectItem value="Health Insurance">Health Insurance</SelectItem>
                              <SelectItem value="Bonds">Bonds</SelectItem>
                              <SelectItem value="Invoice Discounting / FDs">Invoice Discounting / FDs</SelectItem>
                              <SelectItem value="Home Loans">Home Loans</SelectItem>
                              <SelectItem value="Education Loans">Education Loans</SelectItem>
                              <SelectItem value="Loan Against Mutual Funds">Loan Against Mutual Funds</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                              <SelectLabel>Software Solutions</SelectLabel>
                              <SelectItem value="Website Hosting & Domain">Website Hosting & Domain</SelectItem>
                              <SelectItem value="Google Workspace">Google Workspace</SelectItem>
                              <SelectItem value="SME Digital Launch Pack">SME Digital Launch Pack</SelectItem>
                              <SelectItem value="Technical Consulting">Technical Consulting</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                              <SelectLabel>Beart Foundation</SelectLabel>
                              <SelectItem value="Beart Foundation">General Enquiry</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only md:not-sr-only">Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="How can we help you?" rows={4} {...field} disabled={isSubmitting} className="transition-shadow focus:shadow-md text-sm sm:text-base" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full transform transition-transform hover:scale-105 text-sm sm:text-base btn-cta-custom" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </div>

            <Separator className="my-4 md:my-6" />

            <div className="w-full text-left">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Get in Touch Directly</h3>
              <div className="space-y-3 sm:space-y-4">
                <Button size="lg" className="w-full justify-start gap-2 transform transition-transform hover:scale-105 text-sm sm:text-base btn-cta-custom" asChild>
                  <Link href="https://wa.me/919145656666" target="_blank">
                    <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" /> WhatsApp Us (+91-9145656666)
                  </Link>
                </Button>
                <Button size="lg" className="w-full justify-start gap-2 transform transition-transform hover:scale-105 text-sm sm:text-base btn-cta-custom" asChild>
                  <Link href="tel:+919145656666">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5" /> Call +91-9145656666
                  </Link>
                </Button>
                <Button size="lg" className="w-full justify-start gap-2 transform transition-transform hover:scale-105 text-sm sm:text-base btn-cta-custom" asChild>
                  <Link href="mailto:info@beartindia.com">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5" /> Email: info@beartindia.com
                  </Link>
                </Button>
                <Button size="lg" className="w-full justify-start gap-2 transform transition-transform hover:scale-105 text-sm sm:text-base btn-cta-custom" asChild>
                  <Link href="/contact?service=Consultation">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5" /> Schedule a Free Consultation
                  </Link>
                </Button>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
