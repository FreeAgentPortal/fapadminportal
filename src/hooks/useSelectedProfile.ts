import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "@/utils/axios";
import { useUser } from "@/state/auth"; 
import { IAdminType } from "@/types/IAdminType";

// Define the profile type (you may want to create a proper type file for this)
interface ProfileType extends IAdminType {
  needsBillingSetup: boolean;
  billingValidation: BillingValidation;
  profileImageUrl?: string;
  fullName?: string;
  // Add other profile properties as needed
}

interface ProfileResponse {
  payload: ProfileType;
}

interface BillingValidation {
  needsUpdate: boolean;
  reasons: string[];
  severity: "critical" | "warning" | "info";
  recommendations: string[];
}
// Fetch ministry profile data from the server
const fetchProfile = async (userId: string) => {
  const { data } = await axios.get(`/profiles/admin/${userId}`, {});
  return data;
};

export const useSelectedProfile = (
  onSuccess?: (profile: ProfileType | null) => void,
  onError?: (error: Error) => void
): UseQueryResult<ProfileResponse, Error> & { selectedProfile: ProfileType | null } => {
  const { data: loggedInData } = useUser();

  const query = useQuery<ProfileResponse, Error>({
    queryKey: ["profile", "athlete", loggedInData?.profileRefs['admin']],
    queryFn: () => fetchProfile(loggedInData!.profileRefs['admin'] as string),
    enabled: !!loggedInData?._id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    meta: {
      errorMessage: "An error occurred while fetching profile data",
    },
  });

  // Get the selected profile (first profile from the array)
  const selectedProfile = query.data?.payload || null;

  // Handle success callback
  if (query.isSuccess && selectedProfile && onSuccess) {
    onSuccess(selectedProfile);
  }

  // Handle error callback
  if (query.isError && onError) {
    onError(query.error);
  }

  return {
    ...query,
    selectedProfile,
  };
};
