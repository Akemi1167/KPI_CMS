"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { usersService } from "@/features/users/services/usersService";
import { PageHeader } from "@/components/cms/page-header";
import { PaginationBar } from "@/components/common/pagination-bar";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from "@/components/cms/data-table";
import { EmptyState } from "@/components/cms/empty-state";
import { ConfirmDialog } from "@/components/cms/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { useTranslation } from "@/providers/preferences-provider";
import type { PaginatedMeta, User, UserRole } from "@/types/api";

export function UsersPage() {
  const { dict, t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [keyword, setKeyword] = useState("");
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toggleTarget, setToggleTarget] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await usersService.findAll({
        page,
        limit: 20,
        keyword: keyword || undefined,
        role: (role as UserRole) || undefined,
      });
      setUsers(res.data);
      setMeta(res.meta);
    } catch (err) {
      setError(getApiErrorMessage(err, dict.errors));
    } finally {
      setLoading(false);
    }
  }, [keyword, role, dict.errors]);

  useEffect(() => {
    load(1);
  }, [load]);

  async function handleToggleActive() {
    if (!toggleTarget) return;
    setActionLoading(true);
    try {
      if (toggleTarget.isActive) {
        await usersService.deactivate(toggleTarget.id);
      } else {
        await usersService.activate(toggleTarget.id);
      }
      setToggleTarget(null);
      await load(meta.page);
    } catch (err) {
      setError(getApiErrorMessage(err, dict.errors));
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title={dict.users.title}
        description={dict.users.description}
        action={
          <Link href="/admin/users/new">
            <Button>
              <Plus size={16} />
              {dict.users.create}
            </Button>
          </Link>
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="min-w-[200px] flex-1">
          <Input
            placeholder={dict.users.searchPlaceholder}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className="w-40">
          <Select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={[
              { value: "", label: dict.users.allRoles },
              { value: "ADMIN", label: "ADMIN" },
              { value: "EMPLOYEE", label: "EMPLOYEE" },
            ]}
          />
        </div>
        <Button variant="secondary" onClick={() => load(1)} type="button">
          {dict.common.search}
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-danger/30 bg-danger-subtle px-4 py-3 text-[13px] text-danger">
          {error}
        </div>
      )}

      <DataTable
        footer={meta.total > 0 ? <PaginationBar meta={meta} onPageChange={load} /> : undefined}
        empty={
          !loading && users.length === 0 ? (
            <EmptyState description={dict.users.empty} />
          ) : undefined
        }
      >
        {loading ? (
          <tbody>
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-[13px] text-text-muted">
                {dict.common.loading}
              </td>
            </tr>
          </tbody>
        ) : users.length > 0 ? (
          <>
            <DataTableHead>
              <DataTableHeaderCell>{dict.users.employeeCode}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.users.fullName}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.common.email}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.users.role}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.common.status}</DataTableHeaderCell>
              <DataTableHeaderCell align="right">{dict.common.actions}</DataTableHeaderCell>
            </DataTableHead>
            <DataTableBody>
              {users.map((user) => (
                <DataTableRow key={user.id}>
                  <DataTableCell className="font-medium">{user.employeeCode}</DataTableCell>
                  <DataTableCell>{user.fullName}</DataTableCell>
                  <DataTableCell className="text-text-secondary">{user.email}</DataTableCell>
                  <DataTableCell>
                    <Badge variant={user.role === "ADMIN" ? "info" : "default"}>
                      {user.role}
                    </Badge>
                  </DataTableCell>
                  <DataTableCell>
                    <Badge variant={user.isActive ? "success" : "inactive"}>
                      {user.isActive ? dict.common.active : dict.common.inactive}
                    </Badge>
                  </DataTableCell>
                  <DataTableCell align="right">
                    <div className="flex justify-end gap-1">
                      <Link href={`/admin/users/${user.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Pencil size={14} />
                          {dict.common.edit}
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setToggleTarget(user)}
                        type="button"
                      >
                        {user.isActive ? dict.users.deactivate : dict.users.activate}
                      </Button>
                    </div>
                  </DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
          </>
        ) : null}
      </DataTable>

      <ConfirmDialog
        open={Boolean(toggleTarget)}
        title={toggleTarget?.isActive ? dict.users.deactivateTitle : dict.users.activateTitle}
        description={
          toggleTarget
            ? t(
                toggleTarget.isActive
                  ? dict.users.deactivateConfirm
                  : dict.users.activateConfirm,
                { name: toggleTarget.fullName },
              )
            : ""
        }
        confirmLabel={dict.common.confirm}
        cancelLabel={dict.common.cancel}
        loading={actionLoading}
        variant={toggleTarget?.isActive ? "danger" : "default"}
        onConfirm={handleToggleActive}
        onCancel={() => setToggleTarget(null)}
      />
    </div>
  );
}
