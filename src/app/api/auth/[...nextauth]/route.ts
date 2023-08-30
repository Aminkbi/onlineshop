import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { env } from "@/lib/env";
import { mergeAnonymousCartIntoUserCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import { google } from "googleapis";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as PrismaClient),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const getToken = await prisma.account.findFirst({
        where: {
          userId: user.id,
        },
      });

      let access_Token: string | null = null;

      if (getToken) {
        access_Token = getToken.access_token!;
      }

      const oauth2Client = new google.auth.OAuth2(
        env.GOOGLE_CLIENT_ID,

        env.GOOGLE_CLIENT_SECRET,

        `${env.NEXTAUTH_URL}/api/auth/callback/google`
      );

      // @ts-ignore

      oauth2Client.setCredentials({ access_Token });

      const calendar = google.calendar({
        version: "v3",

        auth: oauth2Client,
      });

      calendar.events.list(
        {
          calendarId: "primary", // Use 'primary' for the user's primary calendar

          timeMin: new Date().toISOString(),

          maxResults: 10, // Number of events to retrieve

          singleEvents: true,

          orderBy: "startTime",
        },

        (err, response) => {
          if (err) {
            console.error("Error fetching events:", err);

            return;
          }

          const events = response?.data.items;

          if (events?.length) {
            console.log("Upcoming events:");

            events.forEach((event) => {
              const start = event?.start?.dateTime || event?.start?.date;

              console.log(`${start} - ${event.summary}`);
            });
          } else {
            console.log("No upcoming events found.");
          }
        }
      );

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
