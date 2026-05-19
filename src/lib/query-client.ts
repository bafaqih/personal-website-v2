import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { toast } from "sonner";
import { translations } from "./translations";

// Helper to get active locale
function getLocale(): "en" | "id" {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("admin-language");
    if (stored === "en" || stored === "id") {
      return stored;
    }
  }
  return "en";
}

// Helper to translate keys dynamically outside of React components
function getTranslation(key: string, replacements?: Record<string, string>): string {
  const locale = getLocale();
  const keys = key.split(".");
  let current: any = translations[locale];
  
  for (const k of keys) {
    if (current && typeof current === "object" && k in current) {
      current = current[k];
    } else {
      // Fallback to English
      let fallback: any = translations["en"];
      for (const fk of keys) {
        if (fallback && typeof fallback === "object" && fk in fallback) {
          fallback = fallback[fk];
        } else {
          fallback = null;
          break;
        }
      }
      if (typeof fallback === "string") {
        current = fallback;
      } else {
        return key;
      }
      break;
    }
  }

  if (typeof current !== "string") {
    return key;
  }

  let result = current;
  if (replacements) {
    Object.entries(replacements).forEach(([k, val]) => {
      result = result.replace(new RegExp(`{${k}}`, "g"), val);
    });
  }
  return result;
}

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Automatic Retry: 3 times with exponential backoff
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Background Revalidation
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5, // 5 minutes default
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        const meta = query.meta as Record<string, any> | undefined;
        if (meta?.silent) return; // Allow page-specific silence
        
        const resource = meta?.resource as string;
        const message = resource
          ? getTranslation("common.failed_to_load_resource", { resource: getTranslation(resource) })
          : getTranslation("common.failed_to_load_data");

        // Native Sonner toast with custom action button for retry
        toast.error(message, {
          id: query.queryHash, // Avoid duplicate toast for same query
          duration: 7000,
          action: {
            label: getTranslation("common.retry"),
            onClick: () => {
              // Trigger query execution again
              query.fetch();
            },
          },
        });
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, variables, context, mutation) => {
        const meta = mutation.meta as Record<string, any> | undefined;
        if (meta?.silent) return;

        const action = meta?.action as string; // "save" or "delete"
        const resource = meta?.resource as string;
        
        let message = getTranslation("common.failed");
        if (resource) {
          const translatedResource = getTranslation(resource).toLowerCase();
          if (action === "delete") {
            message = getTranslation("common.lookup.delete_failed");
          } else if (action === "save" || action === "update") {
            message = getTranslation("common.lookup.update_failed");
          }
        }
        
        toast.error(message);
      },
    }),
  });
}
