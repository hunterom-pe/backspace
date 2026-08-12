"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { setTop8 } from "@/lib/top8/actions";
import { Card } from "@/components/Card/Card";
import { PlusIcon, XIcon, GripIcon } from "@/components/icons";
import type { Profile } from "@/lib/types";
import styles from "./Top8Editor.module.css";

type Slot = Profile | null;

export function Top8Editor({
  initialSlots,
  availableFriends,
  ribbonStyle = "classic",
}: {
  initialSlots: Slot[];
  availableFriends: Profile[];
  ribbonStyle?: string;
}) {
  const [slots, setSlots] = useState<Slot[]>(() =>
    Array.from({ length: 8 }, (_, i) => initialSlots[i] ?? null),
  );
  const [pickerIndex, setPickerIndex] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const usedIds = new Set(slots.filter((s): s is Profile => s !== null).map((s) => s.id));
  const pickableFriends = availableFriends.filter((f) => !usedIds.has(f.id));

  function persist(next: Slot[]) {
    const entries = next
      .map((slot, i) => (slot ? { friendId: slot.id, position: i + 1 } : null))
      .filter((e): e is { friendId: string; position: number } => e !== null);

    startTransition(async () => {
      const result = await setTop8(entries);
      setError(result.ok ? null : result.error);
    });
  }

  function updateSlots(next: Slot[]) {
    setSlots(next);
    persist(next);
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      return;
    }
    const next = [...slots];
    [next[dragIndex], next[targetIndex]] = [next[targetIndex], next[dragIndex]];
    setDragIndex(null);
    updateSlots(next);
  }

  function handleRemove(index: number) {
    const next = [...slots];
    next[index] = null;
    updateSlots(next);
  }

  function handlePick(index: number, friend: Profile) {
    const next = [...slots];
    next[index] = friend;
    setPickerIndex(null);
    updateSlots(next);
  }

  return (
    <Card
      title="Top 8"
      action={isPending ? <span className={styles.saving}>Saving...</span> : null}
    >
      {error ? <p className={styles.error}>{error}</p> : null}
      <div className={styles.grid}>
        {slots.map((slot, i) => (
          <div
            key={i}
            className={styles.slot}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(i)}
          >
            {slot ? (
              <div
                className={`${styles.filled} ${i === 0 ? styles.filledFirst : ""}`}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragEnd={() => setDragIndex(null)}
              >
                <span
                  className={`${styles.ribbon} ${i === 0 ? styles.ribbonFirst : ""}`}
                  data-ribbon-style={ribbonStyle}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <GripIcon size={13} className={styles.gripHandle} aria-hidden="true" />
                <Link href={`/profile/${slot.username}`} className={styles.friendLink}>
                  <span className={styles.photoWrap}>
                    {slot.avatar_url ? (
                      <Image
                        src={slot.avatar_url}
                        alt=""
                        width={200}
                        height={200}
                        className={styles.avatar}
                      />
                    ) : (
                      <div className={styles.avatarFallback}>
                        {(slot.display_name ?? slot.username).slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className={styles.tapeCorner} aria-hidden="true" />
                  </span>
                  <span className={styles.name}>{slot.display_name ?? slot.username}</span>
                </Link>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemove(i)}
                  aria-label={`Remove ${slot.display_name ?? slot.username} from Top 8`}
                >
                  <XIcon size={11} strokeWidth={3} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className={styles.addButton}
                onClick={() => setPickerIndex(pickerIndex === i ? null : i)}
                aria-label="Add friend to Top 8"
              >
                <PlusIcon size={20} aria-hidden="true" />
              </button>
            )}

            {pickerIndex === i ? (
              <div
                className={`${styles.picker} ${
                  i % 4 === 0
                    ? styles.pickerAlignLeft
                    : i % 4 === 3
                      ? styles.pickerAlignRight
                      : ""
                }`}
              >
                {pickableFriends.length === 0 ? (
                  <p className={styles.pickerEmpty}>
                    {availableFriends.length === 0
                      ? "Add some friends first."
                      : "No more friends to add."}
                  </p>
                ) : (
                  pickableFriends.map((friend) => (
                    <button
                      key={friend.id}
                      type="button"
                      className={styles.pickerItem}
                      onClick={() => handlePick(i, friend)}
                    >
                      {friend.display_name ?? friend.username}
                    </button>
                  ))
                )}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </Card>
  );
}
