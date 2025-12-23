import { motion } from 'framer-motion';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { TeamMember } from '@/types/types';
import { cn } from '@/lib/utils';

interface TeamMemberCardProps {
    member: TeamMember;
    initialSize: number;
    hoverSize: number;
    className?: string;
}

export default function TeamMemberCard({
    member,
    initialSize,
    hoverSize,
    className,
}: TeamMemberCardProps) {
    const fullImageUrl = strapiImage(member.image?.url || '');

    return (
        <motion.div
            className={cn('relative overflow-hidden group', className)}
            style={{
                cursor: 'pointer',
                height: '520px',
            }}
            initial={{ width: initialSize }}
            whileHover={{ width: hoverSize }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
        >
            {/* Image */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                    src={fullImageUrl}
                    alt={member.image?.alternativeText || `${member.first_name} ${member.last_name}`}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-400"
                />
            </div>

            {/* Overlay avec informations */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <div className="text-white">
                    <p className="text-sm font-medium text-cyan-400 mb-1">
                        {member.poste?.sub_heading || member.poste?.heading}
                    </p>
                    <h3 className="text-xl font-bold">
                        {member.first_name} {member.last_name}
                    </h3>
                </div>
            </div>

            {/* Bordure cyan au hover */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
    );
}