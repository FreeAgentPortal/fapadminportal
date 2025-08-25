import { QueryClient } from "@tanstack/react-query";
import NewsCard from "./components/cards/newsCard/NewsCard.component";
import ServiceChecker from "./components/cards/serviceChecker/ServiceChecker.component";
import SchedulerChecker from "./components/cards/schedulerChecker/SchedulerChecker.component";
import { DashboardRulesEngine } from "./DashboardRulesEngine";
import RecentAthleteSignups from "./components/cards/recentAthletes/RecentAthleteSignups.component";
export interface CardComponentProps {
  data: any; // or AthleteProfile | TeamProfile | etc when you type it
}
export interface Card {
  title: string;
  component: (props: CardComponentProps) => React.ReactNode;
  order?: number; // lower number = higher priority
  size?: number; // NEW: size = column weight (1 = default, 2 = double-width, 3 = triple-width)
  gridKey: string;
  isCard?: boolean;
  hideIf?: ((params: { profile: any; queryClient: QueryClient }) => boolean) | boolean;
}

export default [
  {
    title: "Service Status",
    component: ({ data }: CardComponentProps) => <ServiceChecker />,
    gridKey: "service-status",
    order: 1,
    size: 3,
    isCard: false, // Already has its own Card wrapper
  },
  {
    title: "Scheduler Status",
    component: ({ data }: CardComponentProps) => <SchedulerChecker />,
    gridKey: "scheduler-status",
    order: 2,
    size: 3,
    isCard: false, // Already has its own Card wrapper
  },
  {
    title: "Related News",
    component: ({ data }: CardComponentProps) => <NewsCard />,
    gridKey: "news-content",
    order: 3,
    size: 2,
    isCard: true,
    // hideIf: DashboardRulesEngine.noNews,
  },
  {
    title: "Recent Athlete Signups",
    component: ({ data }: CardComponentProps) => <RecentAthleteSignups />,
    gridKey: "recent-athlete-signups",
    order: 4,
    size: 1,
    isCard: true,
    // hideIf: DashboardRulesEngine.noRecentAthletes,
  },
] as Card[];
