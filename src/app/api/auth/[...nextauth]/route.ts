import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { env } from "@/lib/env";
import { mergeAnonymousCartIntoUserCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.NEXTAUTH_URL + "api/auth/callback/google"
);

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
      session.user.id = user.id;
      const url = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: "offline",

        // If you only need one scope you can pass it as a string
        scope: "https://www.googleapis.com/auth/calendar",
      });
      const { searchParams } = new URL(url);
      const code = searchParams.get("code");
      //@ts-ignore
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });
      calendar.events.list(
        {
          calendarId: "primary",
          timeMin: new Date().toISOString(),
          maxResults: 10,
          singleEvents: true,
          orderBy: "startTime",
        },
        (err, res) => {
          if (err) return console.log("The API returned an error: " + err);
          const events = res?.data.items;
          if (events?.length) {
            console.log("Upcoming 10 events:");
            events.map((event, i) => {
              const start = event?.start?.dateTime || event?.start?.date;
              console.log(`${start} - ${event.summary}`);
            });
          } else {
            console.log("No upcoming events found.");
          }
        }
      );

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
