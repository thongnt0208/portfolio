import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { WiNoteLayout } from './layout/WiNoteLayout';
import { HomeScreen } from './screens/HomeScreen';
import { SearchScreen } from './screens/SearchScreen';
import { CreateNoteScreen } from './screens/CreateNoteScreen';
import { NoteDetailScreen } from './screens/NoteDetailScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { PremiumScreen } from './screens/PremiumScreen';
import './styles/clay-components.css';

export const WiNoteApp: React.FC = () => {
  return (
    <Routes>
      <Route element={<WiNoteLayout />}>
        <Route index element={<HomeScreen />} />
        <Route path="search" element={<SearchScreen />} />
        <Route path="note/new" element={<CreateNoteScreen />} />
        <Route path="note/:id" element={<NoteDetailScreen />} />
        <Route path="settings" element={<SettingsScreen />} />
        <Route path="premium" element={<PremiumScreen />} />
        <Route path="*" element={<Navigate to="/winote" replace />} />
      </Route>
    </Routes>
  );
};
