
import VideoApiElement from "@mux/mux-player/dist/types/video-api";
import { MutableRefObject, createContext, useState } from "react";
import { ITagVodRelation } from "@/lib/tag-vod-relations";

export interface IVideoContextValue {
    timeStamp: number;
    setTimeStamp: Function;
    tvrs: ITagVodRelation[];
    setTvrs: Function;
}

// const defaultContextValue = {
//     timeStamp: 3,
//     setTimeStamp: () => null,
//     ref: null,
// }

export const VideoContext = createContext<IVideoContextValue>({} as IVideoContextValue);


// export function VideoContextProvider({ children }: IAuthContextProps): React.JSX.Element {
//     const { value: authData, set: setAuthData } = useLocalStorageValue<IAuthData | null>('authData', {
//       defaultValue: null,
//     });
  
//     const { value: lastVisitedPath, set: setLastVisitedPath } = useLocalStorageValue<string>('lastVisitedPath', {
//       defaultValue: '/profile',
//       initializeWithValue: false,
//     });
//     const router = useRouter();
  
//     const login = async () => {
//       const currentPath = window.location.pathname;
//       setLastVisitedPath(currentPath);
//       router.push(`${strapiUrl}/api/connect/patreon`);
//     };
  
//     const logout = () => {
//       setAuthData({ accessToken: null, user: null });
//     };
  
//     return (
//       <AuthContext.Provider
//         value={{
//           authData,
//           setAuthData,
//           lastVisitedPath,
//           login,
//           logout,
//         }}
//       >
//         {children}
//       </AuthContext.Provider>
//     );
//   }