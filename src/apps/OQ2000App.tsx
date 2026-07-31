"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import type { Friend } from "@/lib/content-types";
import { useContent } from "@/system/ContentContext";
import { PixelIcon } from "@/system/pixel-icons";
import { useWindowManager } from "@/system/WindowManager";
import type { AppDescriptor } from "@/system/types";

function FriendAvatar({ friend, size }: { friend: Friend; size: number }) {
  const [broken, setBroken] = useState(false);
  if (!friend.avatar || broken) {
    return <PixelIcon name="penguin" size={size} />;
  }
  return (
    <img
      src={friend.avatar}
      alt={friend.name}
      width={size}
      height={size}
      className={"oq-avatar" + (friend.online ? "" : " oq-avatar-offline")}
      onError={() => setBroken(true)}
      loading="lazy"
    />
  );
}

function chatAppDescriptor(friend: Friend): AppDescriptor {
  return {
    id: `oq-chat-${friend.name}`,
    title: `${friend.name} - Chat`,
    icon: "penguin",
    component: function ChatWindow() {
      const [messages, setMessages] = useState<
        { from: "friend" | "me"; text: string }[]
      >([{ from: "friend", text: friend.sign || "……" }]);
      const [draft, setDraft] = useState("");

      const send = () => {
        const text = draft.trim();
        if (!text) return;
        setDraft("");
        setMessages((m) => [
          ...m,
          { from: "me", text },
          {
            from: "friend",
            text: "(Auto-reply) Away from keyboard — come visit my homepage instead! 👉",
          },
        ]);
      };

      return (
        <div className="app-body app-body-fill oq-chat">
          <div className="oq-chat-log sunken-panel">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  "oq-msg" + (m.from === "me" ? " oq-msg-me" : "")
                }
              >
                <b>{m.from === "me" ? "Lazy_V" : friend.name}</b>
                <span>{m.text}</span>
              </div>
            ))}
          </div>
          <div className="toolbar-row oq-chat-input">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              placeholder="Say something…"
            />
            <button onClick={send}>Send</button>
            <a
              className="btn-link"
              href={friend.url}
              target="_blank"
              rel="noreferrer"
            >
              <button>Homepage</button>
            </a>
          </div>
        </div>
      );
    },
    defaultSize: { width: 400, height: 380 },
  };
}

export function OQ2000App() {
  const { friends, site } = useContent();
  const wm = useWindowManager();
  const online = friends.filter((f) => f.online).length;

  return (
    <div className="app-body app-body-fill oq-panel">
      <div className="oq-self">
        <PixelIcon name="penguin" size={32} />
        <div>
          <b>{site.handle}</b>
          <div className="oq-self-status">● Online — {site.title}</div>
        </div>
      </div>
      <div className="oq-group">
        My Friends ({online}/{friends.length} online)
      </div>
      <div className="oq-list sunken-panel">
        {friends.map((f) => (
          <div
            key={f.name}
            className="oq-friend"
            onDoubleClick={() => wm.open(chatAppDescriptor(f))}
            onClick={() => wm.open(chatAppDescriptor(f))}
            title={f.name}
          >
            <FriendAvatar friend={f} size={28} />
            <div className="oq-friend-meta">
              <b>{f.name}</b>
              <span className="oq-sign">{f.sign}</span>
            </div>
            <span className={"oq-dot" + (f.online ? " oq-dot-on" : "")} />
          </div>
        ))}
        {friends.length === 0 ? (
          <p className="hint-text">No friends online.</p>
        ) : null}
      </div>
    </div>
  );
}
