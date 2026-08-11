"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { searchProfiles, type ProfileSearchResult } from "@/lib/search/actions";
import { SearchIcon } from "@/components/icons";
import styles from "./SearchBox.module.css";

const DEBOUNCE_MS = 250;

export function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProfileSearchResult[]>([]);
  const [resultsQuery, setResultsQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const requestId = useRef(0);

  useEffect(() => {
    function onClickAway(event: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onClickAway);
    return () => document.removeEventListener("click", onClickAway);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    const currentRequest = ++requestId.current;
    const timer = setTimeout(async () => {
      const matches = await searchProfiles(trimmed);
      if (requestId.current === currentRequest) {
        setResults(matches);
        setResultsQuery(trimmed);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  const trimmed = query.trim();
  const showDropdown = open && trimmed.length >= 2;
  const loading = trimmed !== resultsQuery;

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <SearchIcon size={18} className={styles.searchIcon} aria-hidden="true" />
      <input
        type="search"
        className={styles.input}
        placeholder="Search backspace..."
        aria-label="Search backspace"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />

      {showDropdown ? (
        <div className={styles.dropdown} role="listbox">
          {loading ? (
            <p className={styles.status}>Searching...</p>
          ) : results.length === 0 ? (
            <p className={styles.status}>No profiles found for &quot;{trimmed}&quot;.</p>
          ) : (
            <ul className={styles.list}>
              {results.map((profile) => {
                const name = profile.display_name || profile.username;
                const initials = name.slice(0, 2).toUpperCase();
                return (
                  <li key={profile.id}>
                    <Link
                      href={`/profile/${profile.username}`}
                      className={styles.item}
                      onClick={() => setOpen(false)}
                    >
                      {profile.avatar_url ? (
                        <Image
                          src={profile.avatar_url}
                          alt=""
                          width={72}
                          height={72}
                          className={styles.avatar}
                        />
                      ) : (
                        <span className={styles.avatarFallback}>{initials}</span>
                      )}
                      <span className={styles.itemBody}>
                        <span className={styles.itemName}>{name}</span>
                        <span className={styles.itemUsername}>@{profile.username}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
