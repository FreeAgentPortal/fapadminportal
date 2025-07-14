import { QueryClient } from '@tanstack/react-query';
import NewsCard from './components/cards/newsCard/NewsCard.component';
import PaymentCard from './components/cards/paymentCard/PaymentCard.component';
import ProfileCard from './components/cards/profileCard/ProfileCard.component';
import { DashboardRulesEngine } from './DashboardRulesEngine';
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
    title: 'Related News',
    component: ({ data }: CardComponentProps) => <NewsCard />,
    gridKey: 'news',
    order: 2,
    size: 2,
    isCard: true,
    hideIf: DashboardRulesEngine.noNews,
  }, 
] as Card[];
