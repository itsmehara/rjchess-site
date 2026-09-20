// Student successes. Empty until names, events and parent permission are
// confirmed for each child — do not add a student here without both.
export type Student = {
  name?: string; // omit if the parent has not agreed to publish the name
  achievement: string;
  year: string;
  photo?: string; // omit if the parent has not agreed to publish the photo
  photoAlt?: string;
};

export const students: Student[] = [];
