"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usersService, type CreateUserPayload, type UpdateUserPayload } from "@/features/users/services/usersService";
import { FormSection } from "@/components/cms/form-section";
import { StickyActionBar } from "@/components/cms/sticky-action-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { useTranslation } from "@/providers/preferences-provider";
import type { User, UserRole } from "@/types/api";

interface UserFormProps {
  user?: User;
}

export function UserForm({ user }: UserFormProps) {
  const router = useRouter();
  const { dict } = useTranslation();
  const isEditing = Boolean(user);

  const [employeeCode, setEmployeeCode] = useState(user?.employeeCode ?? "");
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(user?.role ?? "EMPLOYEE");
  const [positionName, setPositionName] = useState(user?.positionName ?? "");
  const [departmentName, setDepartmentName] = useState(
    user?.departmentName ?? dict.users.defaultDepartment,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isEditing) {
        const payload: UpdateUserPayload = {
          employeeCode,
          fullName,
          email,
          role,
          positionName,
          departmentName,
        };
        await usersService.update(user!.id, payload);
      } else {
        const payload: CreateUserPayload = {
          employeeCode,
          fullName,
          email,
          password,
          role,
          positionName,
          departmentName,
        };
        await usersService.create(payload);
      }
      router.push("/admin/users");
      router.refresh();
    } catch (err) {
      setError(getApiErrorMessage(err, dict.errors));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {error && (
        <div className="mb-4 rounded-md border border-danger/30 bg-danger-subtle px-4 py-3 text-[13px] text-danger">
          {error}
        </div>
      )}

      <FormSection title={dict.users.sectionTitle} description={dict.users.sectionDesc}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={dict.users.fieldEmployeeCode}
            value={employeeCode}
            onChange={(e) => setEmployeeCode(e.target.value)}
            required
          />
          <Input
            label={dict.users.fullName}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            label={dict.common.email}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {!isEditing && (
            <Input
              label={dict.users.fieldPassword}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              helperText={dict.users.passwordHelper}
            />
          )}
          <Select
            label={dict.users.role}
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            options={[
              { value: "EMPLOYEE", label: "EMPLOYEE" },
              { value: "ADMIN", label: "ADMIN" },
            ]}
          />
          <Input
            label={dict.users.fieldPosition}
            value={positionName}
            onChange={(e) => setPositionName(e.target.value)}
          />
          <Input
            label={dict.users.fieldDepartment}
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
          />
        </div>
      </FormSection>

      <StickyActionBar>
        <Link href="/admin/users">
          <Button variant="secondary" type="button">
            {dict.common.cancel}
          </Button>
        </Link>
        <Button type="submit" disabled={loading}>
          {loading ? dict.common.saving : isEditing ? dict.common.save : dict.users.createSubmit}
        </Button>
      </StickyActionBar>
    </form>
  );
}
