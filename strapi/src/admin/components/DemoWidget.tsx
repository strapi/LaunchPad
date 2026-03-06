import React from 'react';
import { Box, Typography, Flex, LinkButton } from '@strapi/design-system';
import { 
  Cast, 
  Database, 
  Image as ImageIcon, 
  Globe, 
  Rocket, 
  ManyWays, 
  Shield, 
  Lock, 
  Sparkle, 
  ExternalLink 
} from '@strapi/icons';

const DemoWidget = () => {
  return (
    <Box
      padding={4}
      background="neutral0"
      borderColor="neutral150"
      hasRadius
    >
      <Flex alignItems="flex-start" gap={6} direction="row" style={{ flexWrap: 'nowrap' }}>
        {/* Left Section */}
        <Box style={{ flex: '1 1 45%' }}>
          <Flex direction="column" alignItems="flex-start" gap={2}>
            <Box marginBottom={2}>
              <Typography variant="alpha" textColor="neutral800" as="h2">
                Hosted Demo Environment
              </Typography>
            </Box>

            <Typography variant="omega" textColor="neutral600">
              Experience Strapi in a production-like setup. Explore the platform as a real team would use it.
            </Typography>
            <Typography variant="omega" textColor="neutral600">
              <strong>All paid features are unlocked</strong> in this demo so you can explore the full capabilities of Strapi. 
            </Typography>
          </Flex>
        </Box>

        {/* Right Section */}
        <Box style={{ flex: '1 1 55%' }}>
          <Flex direction="column" alignItems="flex-start" gap={5}>
            <Flex direction="column" alignItems="flex-start" gap={3}>
              <Typography variant="sigma" textColor="neutral600" textTransform="uppercase">
                Core Features
              </Typography>
              <Flex gap={2} wrap="wrap">
                <LinkButton href="/admin/content-manager/" variant="secondary" startIcon={<Database fill="primary600" />}>
                  Content Manager
                </LinkButton>
                <LinkButton href="/admin/plugins/upload" variant="secondary" startIcon={<ImageIcon fill="primary600" />}>
                  Media Library
                </LinkButton>
                <LinkButton href="/admin/settings/internationalization" variant="secondary" startIcon={<Globe fill="primary600" />}>
                  Internationalization
                </LinkButton>
              </Flex>
            </Flex>

            <Flex direction="column" alignItems="flex-start" gap={3}>
              <Flex gap={2}>
                <Typography variant="sigma" textColor="neutral600" textTransform="uppercase">
                  Premium Features
                </Typography>
                <Sparkle fill="primary600" width="12px" height="12px" />
              </Flex>
              <Flex gap={2} wrap="wrap">
                <LinkButton href="/admin/plugins/content-releases" variant="secondary" startIcon={<Rocket fill="primary600" />}>
                  Releases
                </LinkButton>
                <LinkButton href="/admin/settings/review-workflows" variant="secondary" startIcon={<ManyWays fill="primary600" />}>
                  Review Workflows
                </LinkButton>
                <LinkButton href="/admin/settings/audit-logs" variant="secondary" startIcon={<Shield fill="primary600" />}>
                  Audit Logs
                </LinkButton>
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </Flex>

      {/* Bottom Footer Section */}
      <Box 
        marginTop={6} 
        padding={4} 
        borderColor="neutral150"
      >
        <Flex gap={3}>
          <Lock fill="neutral500" width="16px" height="16px" />
          <Typography variant="omega" textColor="neutral600">
            Content-Type Builder is disabled in production mode.{' '}
            <a 
              href="https://github.com/strapi/LaunchPad" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: '#4945ff', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              Install LaunchPad locally <ExternalLink width="12px" height="12px" />
            </a>{' '}
            to build from scratch.
          </Typography>
        </Flex>
      </Box>
    </Box>
  );
};

export default DemoWidget;
