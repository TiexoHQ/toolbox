rsync -aP \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=.husky \
  --exclude=.github \
  --exclude=.history \
  --exclude=packages/web \
  --exclude=packages/api \
  --exclude=packages/ssc \
  --exclude=packages/common/node_modules \
  --exclude=packages/mint-tool/node_modules \
  --exclude=packages/mint-tool/.next \
  --exclude=packages/mint-tool/out \
  ../marketplace/ ./

  cp packages/mint-tool/README.md ./README.md