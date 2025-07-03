import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/utils/axios";
import { useRouter } from "next/navigation";
import { CryptoService } from "@/utils/CryptoService";
import { useSearchStore as store } from "@/state/search";
import { useInterfaceStore } from "@/state/interface";

function cleanParams(params: Record<string, any>): Record<string, any> {
  const cleaned: Record<string, any> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      cleaned[key] = value;
    }
  });
  return cleaned;
}

const fetchData = async (url: string, method: "GET" | "POST" | "PUT" | "DELETE", data?: any, options?: any) => {
  const secret = process.env.ENCRYPTION_KEY!;
  const cryptoService = new CryptoService(secret);
  let response;
  switch (method) {
    case "GET":
      const {
        defaultKeyword = options?.defaultKeyword || store.getState().search,
        defaultPageNumber = options?.defaultPageNumber || store.getState().pageNumber,
        defaultPageLimit = options?.defaultPageLimit || store.getState().pageLimit,
        defaultFilter = `${options?.defaultFilter ?? ""}${
          store.getState().filter ? `|${store.getState().filter}` : ""
        }`,
        defaultSort = options?.defaultSort || store.getState().sort,
        defaultInclude = options?.defaultInclude || store.getState().include,
      } = options || {};

      response = await axios.get(url, {
        params: {
          ...cleanParams({
            keyword: defaultKeyword,
            pageNumber: defaultPageNumber,
            pageLimit: defaultPageLimit,
            filterOptions: defaultFilter,
            sortOptions: defaultSort,
            includeOptions: defaultInclude,
          }),
        },
      });

      break;
    case "POST":
      response = await axios.post(url, data);
      break;
    case "PUT":
      response = await axios.put(url, data);
      break;
    case "DELETE":
      response = await axios.delete(url, { data });
      break;
    default:
      throw new Error(`Unsupported method: ${method}`);
  }
  if (method === "GET" && typeof response.data.payload === "string") {
    response.data.payload = JSON.parse(cryptoService.decrypt(response.data.payload));
  }
  return response.data;
};
// Reusable Hook
const useApiHook = (options: {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url?: string;
  key: string | string[];
  filter?: any;
  keyword?: string;
  sort?: any;
  include?: any;
  queriesToInvalidate?: string[];
  successMessage?: string;
  redirectUrl?: string;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  cacheTime?: number;
  onSuccessCallback?: (data: any) => void;
  onErrorCallback?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();
  const { addAlert } = useInterfaceStore((state) => state);
  const router = useRouter();

  const {
    method,
    url,
    key,
    filter,
    sort,
    include,
    queriesToInvalidate,
    successMessage,
    redirectUrl,
    keyword,
    enabled = true,
    refetchOnWindowFocus = false,
    staleTime = 1000 * 60 * 5, // 5 minutes
    cacheTime = 1000 * 60 * 10, // 10 minutes
    onSuccessCallback,
    onErrorCallback,
  } = options;

  const queryKey = typeof key === "string" ? [key] : key;

  const query = useQuery({
    queryKey,
    queryFn: () =>
      fetchData(url!, "GET", undefined, {
        defaultKeyword: keyword,
        defaultFilter: filter,
        defaultSort: sort,
        defaultInclude: include,
      }),
    enabled: enabled && method === "GET",
    refetchOnWindowFocus,
    retry: 1,
    staleTime: staleTime,
    gcTime: cacheTime,
    meta: {
      errorMessage: "An error occurred while fetching data",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: { url?: string; formData?: any }) =>
      fetchData(url ? url : (data.url as any), method, data.formData),
    onSuccess: (data: any) => {
      if (successMessage) {
        addAlert({ message: successMessage, type: "success", duration: 3000 });
      }

      queriesToInvalidate?.forEach((query: string) => {
        queryClient.invalidateQueries([query.split(",")] as any);
      });

      if (redirectUrl) {
        router.push(redirectUrl);
      }

      if (onSuccessCallback) {
        onSuccessCallback(data);
      }
    },
    onError: (error: any) => {
      const messageTxt = error.response && error.response.data.message ? error.response.data.message : error.message;

      addAlert({ message: messageTxt, type: "error", duration: 10000 });
      if (onErrorCallback) {
        onErrorCallback(error);
      }
    },
  });

  // Return based on method
  return method === "GET" ? query : mutation;
};

export default useApiHook;
