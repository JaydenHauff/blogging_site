
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
      padding="p-6 md:p-8" /* Increased padding slightly */
      shadow="shadow-xl hover:shadow-2xl transition-shadow duration-300" /* Enhanced shadow */
      rounded="rounded-lg"
    >
      {member.imageUrl && (
        <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 rounded-full overflow-hidden shadow-md border-4 border-primary/30"> {/* Adjusted border color for new theme */}
          <Image
            src={member.imageUrl}
            alt={member.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint={member.imageHint || 'team member portrait'}
          />
        </div>
      )}
      <h3 className="text-xl md:text-2xl font-headline font-semibold text-primary mb-1">{member.name}</h3>
      <p className="text-sm md:text-base text-accent font-medium mb-3">{member.role}</p>
      <p className="text-foreground/80 text-sm md:text-base">{member.bio}</p>
    </TranslucentContainer>
  );
};

export default TeamMemberCard;
