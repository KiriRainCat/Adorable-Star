<template>
  <div class="h-screen bg-[rgb(33,150,243)] text-white text-center flex justify-center items-center">
    <div>
      <div class="text-[30vh]">404</div>

      <div class="text-2xl opacity-40">{{ $t('pageNotFound') }}</div>

      <q-btn class="mt-10 text-blue bg-white" unelevated no-caps to="/" :label="$t('backToHome')" />
    </div>
  </div>
</template>
