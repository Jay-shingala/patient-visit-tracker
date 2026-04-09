export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers ?? {}),
      },
    });

    const payload = (await response.json().catch(() => null)) as T | { error?: string } | null;

    if (!response.ok) {
      const errorMessage =
        payload && typeof payload === "object" && "error" in payload
          ? payload.error
          : "Request failed.";
      throw new Error(errorMessage || "Request failed.");
    }

    return payload as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Network request failed. Please try again.");
  }
}
