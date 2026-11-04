// Delivers a contact-form submission to the TTS API, which stores it in the
// admin inbox and emails the team.
//
// `message` shape (all strings, optional fields may be ""):
//   { firstName, lastName, email, phone, projectType, budget, details }
//
// Resolve when the message is on its way; throw to make the form show its
// error state (which points visitors to hello@thetechspace.com as a fallback).
import { api } from "./api";

export async function sendContactMessage(message) {
  await api("/api/contact", { method: "POST", body: message });
}
