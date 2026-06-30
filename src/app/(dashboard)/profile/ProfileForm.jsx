"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { updateProfile } from "@/actions/profile.actions";

const defaultFormValues = {
  fullName: "",
  username: "",
  email: "",
  bio: "",
  headline: "",
  domain: "",
  githubUrl: "",
  linkedinUrl: "",
  leetcodeUsername: "",
  codeforcesUsername: "",
  replitUrl: "",
  websiteUrl: "",
  avatarUrl: "",
};

function getFormValues(initialData) {
  return Object.fromEntries(
    Object.keys(defaultFormValues).map((key) => [
      key,
      initialData?.[key] ?? defaultFormValues[key],
    ])
  );
}

const ProfileForm = ({ initialData }) => {
  const formValues = getFormValues(initialData);
  const { register, handleSubmit, formState } = useForm({
    defaultValues: defaultFormValues,
    values: formValues,
  });
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState("");
  const avatarObjectUrlRef = useRef("");
  const avatarField = register("avatarFile");
  const avatarPreview = avatarPreviewUrl || formValues.avatarUrl;

  useEffect(() => {
    return () => {
      if (avatarObjectUrlRef.current) {
        URL.revokeObjectURL(avatarObjectUrlRef.current);
      }
    };
  }, []);

  const uploadAvatar = async (file) => {
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    const response = await fetch("/api/profile/avatar", {
      method: "POST",
      body: uploadFormData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to upload avatar");
    }

    return result.url;
  };

  const handleAvatarChange = (event) => {
    avatarField.onChange(event);

    const file = event.target.files?.[0] ?? null;
    setSelectedAvatarFile(file);

    if (avatarObjectUrlRef.current) {
      URL.revokeObjectURL(avatarObjectUrlRef.current);
      avatarObjectUrlRef.current = "";
    }

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      avatarObjectUrlRef.current = objectUrl;
      setAvatarPreviewUrl(objectUrl);
      return;
    }

    setAvatarPreviewUrl("");
  };

  const onSubmit = async (data) => {
    const profileData = { ...data };
    delete profileData.avatarFile;

    try {
      let avatarUrl;

      if (selectedAvatarFile) {
        avatarUrl = await uploadAvatar(selectedAvatarFile);
      }

      const result = await updateProfile({
        ...profileData,
        ...(avatarUrl ? { avatarUrl } : {}),
      });

      if (!result.success) {
        alert("Error: " + result.message);
        return;
      }

      alert("Profile updated successfully!");
    } catch (error) {
      alert(
        "Error: " +
          (error instanceof Error ? error.message : "Unable to update profile")
      );
    }
  };

  return (
    <div className="mx-auto w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-5">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Avatar
          </label>
          <div className="flex items-center gap-5 rounded-xl border border-dashed border-card-border bg-card-bg/50 p-5 transition-colors hover:bg-muted/50">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full bg-muted ring-2 ring-card-border shadow-sm">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-muted-foreground">
                  {formValues.fullName?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>

            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                {...avatarField}
                onChange={handleAvatarChange}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-5 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-hover file:transition-colors file:cursor-pointer"
              />
              <p className="mt-3 text-xs font-medium text-muted-foreground">
                PNG, JPG, WebP, or GIF up to 5MB.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Username
            </label>
            <input
              {...register("username")}
              readOnly
              className="w-full cursor-not-allowed rounded-lg border border-card-border bg-muted px-4 py-2.5 text-muted-foreground outline-none shadow-inner"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Email
            </label>
            <input
              {...register("email")}
              readOnly
              className="w-full cursor-not-allowed rounded-lg border border-card-border bg-muted px-4 py-2.5 text-muted-foreground outline-none shadow-inner"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            Full Name
          </label>
          <input
            {...register("fullName")}
            placeholder="Enter your full name"
            className="w-full px-4 py-2.5 bg-background border border-card-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            Headline
          </label>
          <input
            {...register("headline")}
            placeholder="Describe yourself in a short sentence"
            className="w-full px-4 py-2.5 bg-background border border-card-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            Bio
          </label>
          <textarea
            {...register("bio")}
            rows={4}
            placeholder="Tell people what you build and care about"
            className="w-full px-4 py-3 bg-background border border-card-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm resize-y"
          />
        </div>

        <div className="pt-4 border-t border-card-border">
          <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider text-muted-foreground">Social Links & Profiles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Domain
              </label>
              <input
                {...register("domain")}
                placeholder="Frontend, Backend, AI..."
                className="w-full px-4 py-2.5 bg-background border border-card-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                GitHub
              </label>
              <input
                {...register("githubUrl")}
                placeholder="GitHub URL or username"
                className="w-full px-4 py-2.5 bg-background border border-card-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                LeetCode
              </label>
              <input
                {...register("leetcodeUsername")}
                placeholder="LeetCode profile"
                className="w-full px-4 py-2.5 bg-background border border-card-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Codeforces
              </label>
              <input
                {...register("codeforcesUsername")}
                placeholder="Codeforces profile"
                className="w-full px-4 py-2.5 bg-background border border-card-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                LinkedIn
              </label>
              <input
                {...register("linkedinUrl")}
                placeholder="LinkedIn URL"
                className="w-full px-4 py-2.5 bg-background border border-card-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Replit
              </label>
              <input
                {...register("replitUrl")}
                placeholder="Replit profile"
                className="w-full px-4 py-2.5 bg-background border border-card-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Website
              </label>
              <input
                {...register("websiteUrl")}
                placeholder="https://your-site.com"
                className="w-full px-4 py-2.5 bg-background border border-card-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={formState.isSubmitting}
            className="w-full sm:w-auto bg-primary hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-primary/50 text-white font-bold py-3 px-8 rounded-full transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            {formState.isSubmitting
              ? "Saving..."
              : initialData
              ? "Update Profile"
              : "Create Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
