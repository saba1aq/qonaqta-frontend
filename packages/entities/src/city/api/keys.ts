export const cityKeys = {
  all: ["city"] as const,
  lists: () => [...cityKeys.all, "list"] as const,
} as const
