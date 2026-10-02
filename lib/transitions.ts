/**
 * Names shared by an element on two pages, so a route change morphs it from
 * one to the other instead of cutting (React <ViewTransition name>, enabled
 * by experimental.viewTransition in next.config.ts).
 *
 * One function per kind so the list and the page can never disagree on a
 * name. Names must be unique on a page: each project and dispatch appears
 * once in a list.
 */
export const workTitleTransition = (slug: string) => `work-title-${slug}`;
export const dispatchTitleTransition = (slug: string) => `dispatch-title-${slug}`;
