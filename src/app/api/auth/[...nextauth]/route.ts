import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { env } from "@/lib/env";
import { mergeAnonymousCartIntoUserCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import {google} from 'googleapis';


  const googleCalendarHandler = (access_token : string|null) => {


      const calendar = google.calendar({ version: 'v3', auth: process.env.GOOGLE_API_KEY as string });
  calendar.events.list(
    {
      calendarId: 'primary', // Use 'primary' for the user's primary calendar
      timeMin: new Date().toISOString(),
      maxResults: 10, // Number of events to retrieve
      singleEvents: true,
      orderBy: 'startTime',
    },
    (err, response) => {
      if (err) {
        console.error('Error fetching events:', err);
        return;
      }

      const events = response?.data.items;
      if (events?.length) {
        console.log('Upcoming events:');
        events.forEach((event) => {
          const start = event?.start?.dateTime || event?.start?.date;
          console.log(`${start} - ${event.summary}`);
        });
      } else {
        console.log('No upcoming events found.');
      }
    }
  );
  }

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as PrismaClient),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar"
        }}
    }),
  ],
  callbacks: {
    async session({ session, user }) {
       const getToken = await prisma.account.findFirst({
        where: {
          userId: user.id,
        },
      });

      let accessToken: string | null = null;
      if (getToken) {
        accessToken = getToken.access_token!;
      }
      googleCalendarHandler(accessToken);
      
      session.user.id = user.id;
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      await mergeAnonymousCartIntoUserCart(user.id);
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
