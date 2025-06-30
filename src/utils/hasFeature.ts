export const FEATURES = {};

export const hasFeature = (user: any, ...features: any) => {
  let yesFeature = false;
  if (!features) return true;
  try {
    if (user) {
      user.features.forEach((feature: any) => {
        // set yesFeature to true if the feature is found in the user.features array
        features.map((f: any) =>
          f.idArray.forEach((featureName: any) => {
            // console.log(feature, featureName);
            if (feature === featureName) {
              yesFeature = true;
            }
          })
        );
      });
    }

    return yesFeature;
  } catch {
    return false;
  }
};
