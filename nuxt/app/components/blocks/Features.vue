<script setup lang="ts">
interface FeatureCard {
  title?: string | null;
  description?: string | null;
  span?: string | null;
}

defineProps<{
  heading?: string;
  sub_heading?: string;
  globe_card?: FeatureCard;
  ray_card?: FeatureCard;
  graph_card?: FeatureCard;
  social_media_card?: FeatureCard;
}>();
</script>

<template>
  <div class="relative py-20">
    <Container>
      <Heading data-reveal>{{ heading }}</Heading>
      <Subheading v-if="sub_heading" class="mt-4" data-reveal>
        {{ sub_heading }}
      </Subheading>

      <FeaturesGrid
        :globe_card="globe_card"
        :ray_card="ray_card"
        :graph_card="graph_card"
        :social_media_card="social_media_card"
      />
    </Container>
  </div>
</template>
