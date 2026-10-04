<script setup>
import PageBanner from '../components/PageBanner.vue'
import shrine from '../assets/carousel/6.jpg'
</script>

<template>
  <div>
    <PageBanner title="Our Story" :image="shrine" />

    <section class="content">
      <p>
        Watford Velmurugan Temple began with small weekly Friday services at a
        local community centre. As the congregation grew, the temple moved to
        premises leased from Watford Borough Council in central Watford.
      </p>
      <p>
        In March 2019, the temple relocated to its current site at The Owls
        Bowls Club. The lease with Watford Borough Council is imminently due to
        expire, and the trustees are actively searching for new premises to
        continue serving the community.
      </p>
      <p>
        Watford Velmurugan Temple was the first temple to be consecrated in
        Watford. It celebrates all Hindu festivals, holidays, and special
        occasions, following Saivite traditions of pujas, agamas and worship.
        Everyone is welcome.
      </p>
    </section>
  </div>
</template>

<style scoped>
.content {
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.content p {
  line-height: 1.75;
  color: var(--ink-soft);
  font-size: 1.05rem;
}
</style>
