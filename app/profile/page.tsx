"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useMe,
  useUpdateProfile,
  useChangePassword,
  useLogout,
} from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const { data: user, isLoading } = useMe();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const logout = useLogout();

  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const setP = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setProfileForm((f) => ({ ...f, [k]: e.target.value }));
  const setPw = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setPasswordForm((f) => ({ ...f, [k]: e.target.value }));

  const startEdit = () => {
    setProfileForm({ name: user?.name ?? "", email: user?.email ?? "" });
    setEditingProfile(true);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(profileForm, {
      onSuccess: () => {
        setEditingProfile(false);
        setSuccessMsg("Profile updated.");
        setTimeout(() => setSuccessMsg(""), 3000);
      },
    });
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirm) return;
    changePassword.mutate(
      {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      },
      {
        onSuccess: () => {
          setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirm: "",
          });
          setSuccessMsg("Password changed.");
          setTimeout(() => setSuccessMsg(""), 3000);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    router.push("/auth");
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 border-b border-gray-100 pb-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
          Account
        </p>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-950">
              {user.name}
            </h1>
            <p className="mt-1 text-sm text-gray-500">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}
            >
              {user.role}
            </span>
            <Button
              variant="ghost"
              size="sm"
              loading={logout.isPending}
              onClick={() => logout.mutate()}
            >
              Sign out
            </Button>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-400">
          Member since {formatDate(user.createdAt)}
        </p>
      </div>

      {successMsg && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {successMsg}
        </div>
      )}

      <section className="mb-8 rounded-2xl border border-gray-100 bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
            Profile details
          </h2>
          {!editingProfile && (
            <button
              onClick={startEdit}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
          )}
        </div>

        {editingProfile ? (
          <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
            <Input
              label="Full name"
              value={profileForm.name}
              onChange={setP("name")}
              required
            />
            <Input
              label="Email"
              type="email"
              value={profileForm.email}
              onChange={setP("email")}
              required
            />
            {updateProfile.error && (
              <ErrorMessage message={updateProfile.error.message} />
            )}
            <div className="flex gap-3 pt-1">
              <Button type="submit" size="sm" loading={updateProfile.isPending}>
                Save changes
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => setEditingProfile(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-4">
            {[
              { label: "Full name", value: user.name },
              { label: "Email address", value: user.email },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0"
              >
                <span className="text-xs font-medium text-gray-400">
                  {label}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {value}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-6">
        <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-gray-400">
          Change password
        </h2>
        <form onSubmit={handlePasswordSave} className="flex flex-col gap-4">
          <Input
            label="Current password"
            type="password"
            value={passwordForm.currentPassword}
            onChange={setPw("currentPassword")}
            required
          />
          <Input
            label="New password"
            type="password"
            value={passwordForm.newPassword}
            onChange={setPw("newPassword")}
            required
          />
          <Input
            label="Confirm new password"
            type="password"
            value={passwordForm.confirm}
            onChange={setPw("confirm")}
            error={
              passwordForm.confirm &&
              passwordForm.newPassword !== passwordForm.confirm
                ? "Passwords do not match"
                : undefined
            }
            required
          />
          {changePassword.error && (
            <ErrorMessage message={changePassword.error.message} />
          )}
          <div className="pt-1">
            <Button
              type="submit"
              size="sm"
              loading={changePassword.isPending}
              disabled={
                !passwordForm.currentPassword ||
                !passwordForm.newPassword ||
                passwordForm.newPassword !== passwordForm.confirm
              }
            >
              Update password
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
