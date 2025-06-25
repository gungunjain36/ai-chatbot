//This file is the entry point for the chat application. 
// It handles auth, if the user is not authenticated, it redirects them to the guest auth route.


import { cookies } from 'next/headers';

import { Chat } from '@/components/chat';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { generateUUID } from '@/lib/utils';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { auth } from '../(auth)/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth();

// It handles auth, if the user is not authenticated, it redirects them to the guest auth route.

  if (!session) {
    redirect('/api/auth/guest');
  }
// generate a unique ID for the chat session
  const id = generateUUID();
// get the default model from the cookies, if it exists
  // if not, use the default chat model
  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('chat-model');

  if (!modelIdFromCookie) {
    return (
      <>
        <Chat   // returns the chat component with the props if model is not from the cookies. 
          key={id}
          id={id}
          initialMessages={[]}
          initialChatModel={DEFAULT_CHAT_MODEL}   //default chat model is used if no model is found in the cookies.
          initialVisibilityType="private"
          isReadonly={false}
          session={session}
          autoResume={false}
        />
        <DataStreamHandler id={id} />             {/* this is the data stream handler that handles the data stream for the chat. */}
      </>
    );
  }

  return (                 // return the chat component with the props if model is from the cookies.
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        initialChatModel={modelIdFromCookie.value}
        initialVisibilityType="private"
        isReadonly={false}
        session={session}
        autoResume={false}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
