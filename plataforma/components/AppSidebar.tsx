'use client'

import {
  BellRing,
  Building2,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Command,
  FolderKanban,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
  Users,
} from 'lucide-react'
import { Imovel } from '@/lib/types'

interface AppSidebarProps {
  imoveis: Imovel[]
  filteredCount: number
}

export default function AppSidebar({ imoveis, filteredCount }: AppSidebarProps) {
  const dashboardCount = Math.min(filteredCount, 99)
  const taskCount = Math.min(imoveis.length, 24)

  return (
    <aside
      className="hidden xl:flex xl:w-[220px] xl:min-w-[220px] xl:flex-col xl:justify-between"
      style={{
        background: '#1E2140',
        borderRight: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <div className="px-4 pb-4 pt-3">
        <div className="flex h-10 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full"
              style={{
                background: 'linear-gradient(135deg, #6C72FF 0%, #4A52D9 100%)',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)',
              }}
            >
              <BellRing className="h-3.5 w-3.5 text-white" strokeWidth={2.1} />
            </div>
            <span className="text-[14px] font-semibold leading-5 tracking-[-0.02em] text-white">
              Nexus
            </span>
          </div>
          <button
            className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
            style={{ color: '#C9CEE7', border: '1px solid rgba(255,255,255,0.08)' }}
            aria-label="Expandir sidebar"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <nav className="mt-3 space-y-0.5">
          <SidebarItem icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" />
          <SidebarItem
            icon={<ClipboardList className="h-4 w-4" />}
            label="Task"
            badge={taskCount > 0 ? String(taskCount) : '1'}
            danger
          />
          <SidebarItem icon={<CalendarDays className="h-4 w-4" />} label="Calendar" />
        </nav>

        <SectionDivider />

        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between px-2">
            <span
              className="text-[11px] font-medium uppercase leading-4 tracking-[0.08em]"
              style={{ color: '#8E94B7' }}
            >
              Sales
            </span>
            <div className="flex items-center gap-2" style={{ color: '#C7CCE5' }}>
              <Search className="h-3.5 w-3.5" />
              <Plus className="h-3.5 w-3.5" />
            </div>
          </div>
          <nav className="space-y-0.5">
            <SidebarItem icon={<Users className="h-4 w-4" />} label="Leads" />
            <SidebarItem icon={<Command className="h-4 w-4" />} label="Opportunities" />
            <SidebarItem icon={<FolderKanban className="h-4 w-4" />} label="Contacts" />
            <SidebarItem
              icon={<Building2 className="h-4 w-4" />}
              label="Companies"
              active
              badge={dashboardCount > 0 ? String(dashboardCount) : undefined}
            />
          </nav>
        </div>

        <div className="mt-5">
          <div
            className="mb-2 px-2 text-[11px] font-medium uppercase leading-4 tracking-[0.08em]"
            style={{ color: '#8E94B7' }}
          >
            Marketing
          </div>
          <nav className="space-y-0.5">
            <SidebarItem icon={<FolderKanban className="h-4 w-4" />} label="Forms" />
            <SidebarItem icon={<Command className="h-4 w-4" />} label="Emails" />
            <SidebarItem icon={<CircleHelp className="h-4 w-4" />} label="Social Media Ads" />
          </nav>
        </div>
      </div>

      <div className="px-4 pb-4">
        <SectionDivider />
        <nav className="mt-3 space-y-0.5">
          <SidebarItem icon={<CircleHelp className="h-4 w-4" />} label="Help and Support" />
          <SidebarItem icon={<Settings className="h-4 w-4" />} label="Settings" />
        </nav>

        <div
          className="mt-4 flex items-center gap-2 rounded-xl px-2.5 py-2.5"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold leading-none text-slate-900"
            style={{ background: 'linear-gradient(180deg, #F2D0AE 0%, #D3A176 100%)' }}
          >
            JH
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium leading-5 text-white">John Marpaung</p>
            <p className="truncate text-[11px] leading-4" style={{ color: '#A6AAC5' }}>
              john@gmail.com
            </p>
          </div>
          <button
            className="flex h-6 w-6 items-center justify-center rounded-md"
            style={{ color: '#C7CCE5', border: '1px solid rgba(255,255,255,0.08)' }}
            aria-label="Abrir perfil"
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </aside>
  )
}

function SidebarItem({
  icon,
  label,
  active = false,
  badge,
  danger = false,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  badge?: string
  danger?: boolean
}) {
  return (
    <button
      className="flex h-10 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-[13px] font-medium leading-5 transition-all"
      style={{
        color: active ? '#FFFFFF' : '#D4D7E8',
        backgroundColor: active ? 'rgba(120, 136, 188, 0.22)' : 'transparent',
        border: `1px solid ${active ? 'rgba(255, 255, 255, 0.06)' : 'transparent'}`,
      }}
    >
      <span style={{ color: active ? '#E7EAFA' : '#B4BAD7' }}>{icon}</span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {badge ? (
        <span
          className="inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold leading-none"
          style={{
            color: danger ? '#FFFFFF' : '#7A809F',
            backgroundColor: danger ? '#E25363' : 'rgba(255,255,255,0.1)',
          }}
        >
          {badge}
        </span>
      ) : null}
    </button>
  )
}

function SectionDivider() {
  return <div className="mt-4 h-px w-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
}
