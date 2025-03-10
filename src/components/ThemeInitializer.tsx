   // src/components/ThemeInitializer.tsx
   import React, { useEffect } from 'react';
   import { useSetRecoilState } from 'recoil';
   import { themesState } from '../store/themeState';
   import { loadThemes } from '../utils/storage';

   const ThemeInitializer = () => {
     const setThemes = useSetRecoilState(themesState);

     useEffect(() => {
       const initializeThemes = async () => {
         const loadedThemes = await loadThemes();
         if (loadedThemes.length > 0) {
           setThemes(loadedThemes);
         }
       };

       initializeThemes();
     }, [setThemes]);

     return null; 
   };

   export default ThemeInitializer;