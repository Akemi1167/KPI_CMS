"use client";

import { PageHeader } from "@/components/cms/page-header";
import { UserForm } from "@/features/users/components/user-form";
import { useTranslation } from "@/providers/preferences-provider";

export default function NewUserPage() {
  const { dict } = useTranslation();

  return (
    <div>
      <PageHeader title={dict.users.createTitle} description={dict.users.createDesc} />
      <UserForm />
    </div>
  );
}
