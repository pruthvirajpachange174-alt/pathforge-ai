/** Renders the Dashboard Layout interface component. */
import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Dialog.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <div className="flex min-h-screen">
        <Sidebar onClose={() => setMobileMenuOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onMenuClick={() => setMobileMenuOpen(true)} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </Dialog.Root>
  );
}