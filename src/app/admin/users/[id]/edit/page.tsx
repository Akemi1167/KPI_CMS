"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usersService } from "@/features/users/services/usersService";
import { PageHeader } from "@/components/cms/page-header";
import { UserForm } from "@/features/users/components/user-form";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { useTranslation } from "@/providers/preferences-provider";
import type { User } from "@/types/api";

export default function EditUserPage() {
  const params = useParams<{ id: string }>();
  const { dict } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    usersService
      .findById(params.id)
      .then((res) => setUser(res.data))
      .catch((err) => setError(getApiErrorMessage(err, dict.errors)));
  }, [params.id, dict.errors]);

  if (error) {
    return <p className="text-[13px] text-danger">{error}</p>;
  }

  if (!user) {
    return <p className="text-[13px] text-text-muted">{dict.common.loading}</p>;
  }

  return (
    <div>
      <PageHeader title={dict.users.editTitle} description={user.fullName} />
      <UserForm user={user} />
    </div>
  );
}
