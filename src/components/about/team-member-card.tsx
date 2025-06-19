import type { TeamMember } from '@/types';
import Image from 'next/image';
import TranslucentContainer from '@/components/ui/translucent-container';

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  return (
    <TranslucentContainer 
      className="text-center"
      baseColor="card"
      backgroundOpacity={70}
      padding="p-6"
      shadow="shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      {member.imageUrl && (
        <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-md border-4 border-primary/20">
          <Image
            src={member.imageUrl}
            alt={member.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint={member.imageHint || 'team member portrait'}
          />
        </div>
      )}
      <h3 className="text-xl font-headline font-semibold text-primary mb-1">{member.name}</h3>
      <p className="text-sm text-accent font-medium mb-2">{member.role}</p>
      <p className="text-foreground/80 text-sm">{member.bio}</p>
    </TranslucentContainer>
  );
};

export default TeamMemberCard;
